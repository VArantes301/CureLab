#pragma once

#include "../config/database.hpp"
#include <pqxx/pqxx>
#include <string>
#include <iostream>
#include <vector>
#include <optional>

struct DiaryImage {
    int id;
    int diary_id;
    std::string image_url;
};

struct Diary {
    int id;
    int user_id;
    std::string title;
    std::string content;
    int mood;
    std::string created_at;
    std::vector <DiaryImage> images;
};

class DiaryModel {
    private:
        Database& dbConfig;

        template <typename RowType>
        static Diary rowToDiary(const RowType& row) {
            Diary diary;
            diary.id         = row["id"].template as<int>();
            diary.user_id    = row["user_id"].template as<int>();
            diary.title      = row["title"].template as<std::string>();
            diary.content    = row["content"].template as<std::string>("");
            diary.mood       = row["mood"].template as<int>();
            diary.created_at = row["created_at"].template as<std::string>("");
            return diary;
        }

        template <typename RowType>
        static DiaryImage rowToImage(const RowType& row) {
            DiaryImage image;
            image.id        = row["id"].template as<int>();
            image.diary_id  = row["diary_id"].template as<int>();
            image.image_url = row["image_url"].template as<std::string>();
            return image;
        }

    public:
        DiaryModel(Database& db) : dbConfig(db) {}

        //create as tables dos diarios
        bool createTable() {
            try {
                pqxx::work txn(dbConfig.getConnection());

                txn.exec("CREATE TABLE IF NOT EXISTS diaries("
                         "id SERIAL PRIMARY KEY, "
                         "user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, "
                         "title VARCHAR(150) NOT NULL, "
                         "content TEXT NOT NULL, "
                         "mood SMALLINT NOT NULL CHECK (mood BETWEEN 0 AND 5), "
                         "created_at TIMESTAMP NOT NULL DEFAULT NOW())");

                txn.exec("CREATE TABLE IF NOT EXISTS diary_images("
                         "id SERIAL PRIMARY KEY, "
                         "diary_id INTEGER NOT NULL REFERENCES diaries(id) ON DELETE CASCADE, "
                         "image_url TEXT NOT NULL)");

                txn.commit();
                std::cout << "tables 'diaries' e 'diary_images' criadas com sucesso" << std::endl;
                return true;
            } catch (const std::exception& e) {
                std::cerr << "erro ao criar tabelas de diario: " << e.what() << std::endl;
            }
            return false;
        }

        //cria o diario
        Diary create(const int userId, const std::string title, const std::string content, const int mood) {
            pqxx::work txn(dbConfig.getConnection());

            auto row = txn.exec_params1(
                "INSERT INTO diaries(user_id, title, content, mood) "
                "VALUES ($1, $2, $3, $4, $5) "
                "RETURNING id, user_id, title, content, mood, created_at",
                userId, title, content, mood);
            txn.commit();

            return rowToDiary(row);
        }

        //add as imagens
        DiaryImage addImage(int diaryId, const std::string& imageUrl) {
            pqxx:: work txn(dbConfig.getConnection());

            auto row = txn.exec_params1(
                "INSERT INTO diary_images(diary_id, image_url) "
                "VALUES ($1, $2), ",
                "RETURNING id, diary_id, image_url",
                diaryId, imageUrl);
            txn.commit();

            return rowToImage(row);
        }

        //show titulo, humor e data. o conteudo volta vazio por privacidade.
        std::vector<Diary> findByUser(int userId) {
            pqxx::read_transaction txn(dbConfig.getConnection());

            pqxx::result result = txn.exec_params(
                "SELECT id, user_id, title, '' AS content, mood, created_at "
                "FROM diaries "
                "WHERE user_id = $1 "
                "ORDER BY created_at DESC",
                userId);

            std::vector<Diary> diaries;
            for (const auto& row : result) {
                diaries.push_back(rowToDiary(row));
            }
            return diaries;
        }

        //encontra o diario e detalhes.
        std::optional<Diary> findById(int diaryId, int userId) {
            pqxx::read_transaction txn(dbConfig.getConnection());

            //o AND NÃO deixa outro user acessar
            pqxx::result diaryResult = txn.exec_params(
                "SELECT id, user_id, title, content, mood, created_at "
                "FROM diaries WHERE id = $1 AND user_id = $2",
                diaryId, userId);

            if (diaryResult.empty()) {
                return std::nullopt;   // equivale ao null
            }

            Diary diary = rowToDiary(diaryResult[0]);

            pqxx::result imagesResult = txn.exec_params(
                "SELECT id, diary_id, image_url FROM diary_images WHERE diary_id = $1",
                diaryId);

            for (const auto& row : imagesResult) {
                diary.images.push_back(rowToImage(row));
            }

            return diary;
        }
};