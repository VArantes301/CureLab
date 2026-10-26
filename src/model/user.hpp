#pragma once

#include "../config/database.hpp"
#include <pqxx/pqxx>
#include <string>
#include <iostream>
#include <vector>
#include <optional>

struct User {
    int id;
    std::string name;
    std::string email;
    std::string password;
    std::string phone1;
    std::string phone2;
    std::string addiction_type;
    int current_streak;
    int longest_streak;
    std::string last_diary_date;
    std::string mascot;
};

class UserModel {
    private:
        Database& dbConfig;

        static constexpr const char* COLUMNS =
            "id, name, email, phone1, phone2, addiction_type, "
            "current_streak, longest_streak, last_diary_date, mascot";

        //define que RowType e um tipo qualquer
        template <typename RowType>
        static User rowToUser(const RowType& row) {

            User user;
            user.id              = row["id"].template as<int>();
            user.name            = row["name"].template as<std::string>();
            user.email           = row["email"].template as<std::string>();
            user.phone1          = row["phone1"].template as<std::string>("");
            user.phone2          = row["phone2"].template as<std::string>("");
            user.addiction_type  = row["addiction_type"].template as<std::string>("");
            user.current_streak  = row["current_streak"].template as<int>();
            user.longest_streak  = row["longest_streak"].template as<int>();
            user.last_diary_date = row["last_diary_date"].template as<std::string>("");
            user.mascot          = row["mascot"].template as<std::string>("");
            return user;
        }

    public:
        UserModel(Database& db) : dbConfig(db) {}

        //criar tabela do postgreeSQL
        bool createTable() {
            try {

                pqxx::work txn(dbConfig.getConnection());

                std::string sql = "CREATE TABLE IF NOT EXISTS users("
                                  "id SERIAL PRIMARY KEY, "
                                  "name VARCHAR(100) NOT NULL, "
                                  "email VARCHAR(100) UNIQUE NOT NULL, "
                                  "password TEXT NOT NULL, "
                                  "phone1 VARCHAR(20), "
                                  "phone2 VARCHAR(20), "
                                  "addiction_type VARCHAR(50), "
                                  "current_streak INTEGER NOT NULL DEFAULT 0, "
                                  "longest_streak INTEGER NOT NULL DEFAULT 0, "
                                  "last_diary_date DATE, "
                                  "mascot VARCHAR(50))";
                
                txn.exec(sql);
                txn.commit();

                std::cout << "table 'users' criada com  sucesso" << std::endl;
                return true;
            } catch (const std::exception& e) {
                std::cerr << "erro ao criar tabela: " << e.what() << std::endl;
            }
            return false;
        }

        //criar usuarios
        User addUser(const std::string& name, const std::string& email, const std::string& password, const std::string& phone1, const std::string phone2) {
            pqxx::work txn(dbConfig.getConnection());

            std::string sql = "INSERT INTO users(name, email, password, phone1, phone2) "
                              "VALUES ($1, $2, $3, $4, $5) "
                              "RETURNING " + std::string(COLUMNS);


            auto row = txn.exec_params1(sql, name, email, password, phone1, phone2);
            txn.commit();

            return rowToUser(row);
        }

        //procurar todos os usuarios
        std::vector<User> findAll() {
            pqxx::read_transaction txn(dbConfig.getConnection());

            std::string sql = "SELECT " + std::string(COLUMNS) +" FROM users";
            pqxx::result result = txn.exec(sql);

            std::vector<User> users;
            for(const auto& row : result) {
                users.push_back(rowToUser(row));
            }
            return users;
        }

        //procurar usuario por id
        std::optional<User> findById(const int id) {
            pqxx::read_transaction txn(dbConfig.getConnection());

            std::string sql = "SELECT " + std::string(COLUMNS) + " FROM users WHERE id = $1";
            pqxx::result result = txn.exec_params(sql, id);

            if(result.empty()) {
                return std::nullopt;
            }

            return rowToUser(result[0]);

        }

        //procurar usuario por name
        std::optional<User> findByName(const std::string name) {
            pqxx::read_transaction txn(dbConfig.getConnection());

            std::string sql = "SELECT " + std::string(COLUMNS) + ", password FROM users WHERE name =$1";
            pqxx::result result = txn.exec_params(sql, name);

            if(result.empty()) {
                return std::nullopt;
            }

            User user = rowToUser(result[0]);
            user.password = result[0]["password"].as<std::string>();

            return user;
        }

        //procurar usuario por email
        std::optional<User> findByEmail(const std::string& email) {
            pqxx::read_transaction txn(dbConfig.getConnection());

            std::string sql = "SELECT " + std::string(COLUMNS) + ", password FROM users WHERE email = $1";
            pqxx::result result = txn.exec_params(sql, email);

            if (result.empty()) {
                return std::nullopt; //retorna valor null do C++
            }

            User user = rowToUser(result[0]);
            user.password = result[0]["password"].as<std::string>();

            return user;

        }

        //sobe novo valor da streak
        bool updateStreak(int userId, int currentStreak, const std::string& lastDiaryDate, int longestStreak) {
            pqxx::work txn(dbConfig.getConnection());

            std::string sql = "UPDATE users "
                              "SET current_streak = $1, last_diary_date = $2, longest_streak = $3 "
                              "WHERE id = $4";

            txn.exec_params(sql, currentStreak, lastDiaryDate, longestStreak, userId);
            txn.commit();
            return true;
        }

        //sobre novo valor para addiction
        bool updateAddiction(int userId, const std::string addictionType) {
            pqxx::work txn(dbConfig.getConnection());

            std::string sql = "UPDATE users "
                              "SET addiction_type = $1 "
                              "WHERE id = $2";

            txn.exec_params(sql, addictionType, userId);
            txn.commit();
            return true;
        }

        //sobe novo valor para phone1
        bool updatePhone1(int userId, const std::string phone1) {
            pqxx::work txn(dbConfig.getConnection());

            std::string sql = "UPDATE users "
                              "SET phone1 = $1 "
                              "WHERE id = $2";

            txn.exec_params(sql, phone1, userId);
            txn.commit();

            return true;
        }

        //sobe novo valor para phone2
        bool updatePhone2(int userId, const std::string phone2) {
            pqxx::work txn(dbConfig.getConnection());

            std::string sql = "UPDATE users "
                              "SET phone2 = $1 "
                              "WHERE id = $2";

            txn.exec_params(sql, phone2, userId);
            txn.commit();

            return true;
        }

        //sobre nova url do mascot
        bool updateMascot(int userId, const std::string mascot) {
            pqxx::work txn(dbConfig.getConnection());

            std::string sql = "UPDATE users "
                              "SET mascot = $1 "
                              "WHERE id = $2";

            txn.exec_params(sql, mascot, userId);
            txn.commit();

            return true;
        }

        
};