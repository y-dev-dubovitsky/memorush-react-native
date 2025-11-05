import SQLite from 'react-native-sqlite-storage';

class CardSetsDatabase {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.initDatabase();
  }

  initDatabase = () => {
    this.db = SQLite.openDatabase(
      {
        name: 'FlashcardsDB.db',
        location: 'default',
      },
      () => {
        console.log('✅ База данных открыта');
        this.createTables();
      },
      error => {
        console.error('❌ Ошибка открытия БД:', error);
        this.db = null;
      }
    );
  }

  createTables = () => {
    if (!this.db) {
      console.warn('База данных не инициализирована');
      return;
    }

    this.db.transaction(tx => {
      // Таблица наборов карточек
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS card_sets (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          tags TEXT,
          category_name TEXT,
          description TEXT,
          is_favorite INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        [],
        () => console.log('✅ Таблица card_sets создана'),
        error => console.error('❌ Ошибка создания card_sets:', error)
      );

      // Таблица карточек
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS flashcards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          card_set_id TEXT NOT NULL,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          example TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (card_set_id) REFERENCES card_sets (id) ON DELETE CASCADE
        )`,
        [],
        () => {
          console.log('✅ Таблица flashcards создана');
          this.isInitialized = true;
        },
        error => console.error('❌ Ошибка создания flashcards:', error)
      );
    });
  }

  // ==================== CARD SETS OPERATIONS ====================

  // Получить все наборы карточек
  getAllCardSets = async () => {
    if (!this.db || !this.isInitialized) {
      console.warn('База данных не готова');
      return [];
    }

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT 
            cs.*,
            COUNT(f.id) as cards_count
           FROM card_sets cs
           LEFT JOIN flashcards f ON cs.id = f.card_set_id
           GROUP BY cs.id
           ORDER BY cs.updated_at DESC`,
          [],
          (tx, results) => {
            const cardSets = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              cardSets.push({
                id: row.id,
                name: row.name,
                tags: row.tags ? row.tags.split(',') : [],
                categoryName: row.category_name,
                description: row.description,
                isFavorite: Boolean(row.is_favorite),
                cardsCount: row.cards_count,
                createdAt: row.created_at,
                updatedAt: row.updated_at
              });
            }
            console.log(`✅ Загружено наборов: ${cardSets.length}`);
            resolve(cardSets);
          },
          error => {
            console.warn('❌ Ошибка загрузки наборов:', error);
            reject(error);
          }
        );
      });
    });
  }

  // Получить набор по ID
  getCardSetById = async (cardSetId) => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        // Получаем основную информацию о наборе
        tx.executeSql(
          `SELECT * FROM card_sets WHERE id = ?`,
          [cardSetId],
          async (tx, setResults) => {
            if (setResults.rows.length === 0) {
              resolve(null);
              return;
            }

            const cardSet = setResults.rows.item(0);
            
            // Получаем карточки этого набора
            tx.executeSql(
              `SELECT * FROM flashcards WHERE card_set_id = ? ORDER BY id`,
              [cardSetId],
              (tx, cardResults) => {
                const flashcards = {};
                for (let i = 0; i < cardResults.rows.length; i++) {
                  const card = cardResults.rows.item(i);
                  flashcards[i] = {
                    question: card.question,
                    answer: card.answer,
                    example: card.example
                  };
                }

                const result = {
                  id: cardSet.id,
                  name: cardSet.name,
                  tags: cardSet.tags ? cardSet.tags.split(',') : [],
                  categoryName: cardSet.category_name,
                  description: cardSet.description,
                  isFavorite: Boolean(cardSet.is_favorite),
                  flashCardArray: flashcards,
                  createdAt: cardSet.created_at,
                  updatedAt: cardSet.updated_at
                };

                console.log(`✅ Набор загружен: ${result.name}, карточек: ${Object.keys(flashcards).length}`);
                resolve(result);
              },
              error => {
                console.warn('❌ Ошибка загрузки карточек:', error);
                reject(error);
              }
            );
          },
          error => {
            console.warn('❌ Ошибка загрузки набора:', error);
            reject(error);
          }
        );
      });
    });
  }

  // Создать новый набор
  createCardSet = async (cardSetData) => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        const cardSetId = cardSetData.id || Date.now().toString();
        const tagsString = Array.isArray(cardSetData.tags) 
          ? cardSetData.tags.join(',') 
          : (cardSetData.tags || '');

        // Сохраняем набор
        tx.executeSql(
          `INSERT INTO card_sets (id, name, tags, category_name, description, is_favorite)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cardSetId,
            cardSetData.name,
            tagsString,
            cardSetData.categoryName,
            cardSetData.description,
            cardSetData.isFavorite ? 1 : 0
          ],
          async (tx, setResults) => {
            console.log('✅ Набор сохранен, ID:', cardSetId);

            // Сохраняем карточки
            if (cardSetData.flashCardArray && Object.keys(cardSetData.flashCardArray).length > 0) {
              await this.saveFlashcards(tx, cardSetId, cardSetData.flashCardArray);
            }

            resolve({ ...cardSetData, id: cardSetId });
          },
          error => {
            console.warn('❌ Ошибка сохранения набора:', error);
            reject(error);
          }
        );
      });
    });
  }

  // Обновить набор
  updateCardSet = async (cardSetId, cardSetData) => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        const tagsString = Array.isArray(cardSetData.tags) 
          ? cardSetData.tags.join(',') 
          : (cardSetData.tags || '');

        // Обновляем набор
        tx.executeSql(
          `UPDATE card_sets 
           SET name = ?, tags = ?, category_name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [
            cardSetData.name,
            tagsString,
            cardSetData.categoryName,
            cardSetData.description,
            cardSetId
          ],
          async (tx, setResults) => {
            console.log('✅ Набор обновлен:', cardSetId);

            // Удаляем старые карточки и сохраняем новые
            tx.executeSql(
              'DELETE FROM flashcards WHERE card_set_id = ?',
              [cardSetId],
              async () => {
                if (cardSetData.flashCardArray && Object.keys(cardSetData.flashCardArray).length > 0) {
                  await this.saveFlashcards(tx, cardSetId, cardSetData.flashCardArray);
                }
                resolve({ ...cardSetData, id: cardSetId });
              },
              error => {
                console.warn('❌ Ошибка удаления старых карточек:', error);
                reject(error);
              }
            );
          },
          error => {
            console.warn('❌ Ошибка обновления набора:', error);
            reject(error);
          }
        );
      });
    });
  }

  // Сохранить карточки
  saveFlashcards = async (tx, cardSetId, flashCardArray) => {
    const cards = Object.values(flashCardArray);
    
    for (const card of cards) {
      if (card.question && card.answer) {
        await new Promise((resolve, reject) => {
          tx.executeSql(
            `INSERT INTO flashcards (card_set_id, question, answer, example)
             VALUES (?, ?, ?, ?)`,
            [
              cardSetId,
              card.question,
              card.answer,
              card.example || ''
            ],
            () => resolve(),
            error => {
              console.warn('❌ Ошибка сохранения карточки:', error);
              reject(error);
            }
          );
        });
      }
    }
    console.log(`✅ Сохранено карточек: ${cards.length}`);
  }

  // Удалить набор
  deleteCardSet = async (cardSetId) => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM card_sets WHERE id = ?',
          [cardSetId],
          (tx, results) => {
            console.log('✅ Набор удален:', cardSetId);
            resolve({ id: cardSetId });
          },
          error => {
            console.warn('❌ Ошибка удаления набора:', error);
            reject(error);
          }
        );
      });
    });
  }

  // Переключить избранное
  toggleFavorite = async (cardSetId) => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        // Сначала получаем текущее состояние
        tx.executeSql(
          'SELECT is_favorite FROM card_sets WHERE id = ?',
          [cardSetId],
          (tx, results) => {
            if (results.rows.length === 0) {
              reject(new Error('Набор не найден'));
              return;
            }

            const currentFavorite = results.rows.item(0).is_favorite;
            const newFavorite = currentFavorite ? 0 : 1;

            // Обновляем
            tx.executeSql(
              'UPDATE card_sets SET is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
              [newFavorite, cardSetId],
              async () => {
                // Получаем обновленный набор
                const updatedSet = await this.getCardSetById(cardSetId);
                resolve(updatedSet);
              },
              error => {
                console.warn('❌ Ошибка обновления избранного:', error);
                reject(error);
              }
            );
          },
          error => {
            console.warn('❌ Ошибка получения набора:', error);
            reject(error);
          }
        );
      });
    });
  }

  // Поиск наборов по имени
  searchCardSets = async (searchTerm) => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT 
            cs.*,
            COUNT(f.id) as cards_count
           FROM card_sets cs
           LEFT JOIN flashcards f ON cs.id = f.card_set_id
           WHERE cs.name LIKE ?
           GROUP BY cs.id
           ORDER BY cs.updated_at DESC`,
          [`%${searchTerm}%`],
          (tx, results) => {
            const cardSets = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              cardSets.push({
                id: row.id,
                name: row.name,
                tags: row.tags ? row.tags.split(',') : [],
                categoryName: row.category_name,
                description: row.description,
                isFavorite: Boolean(row.is_favorite),
                cardsCount: row.cards_count
              });
            }
            resolve(cardSets);
          },
          error => {
            console.warn('❌ Ошибка поиска:', error);
            reject(error);
          }
        );
      });
    });
  }
}

// Создаем singleton экземпляр
const cardSetsDB = new CardSetsDatabase();

export default cardSetsDB;