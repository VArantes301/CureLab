#pragma once //impede de arquivo .h ser copilado varias vezes

#include <pqxx/pqxx>
#include <string>
#include <iostream>
#include <memory>

class Database {
    private: 
        std::string connectionString; //string com IP, port, user, password e name
        std::unique_ptr<pqxx::connection> conn; //ponteiro inteligente, evita vazamento de memoria

    public:

        //recebe a string da conexão
        Database(const std::string& connStr) : connectionString(connStr) {}

        bool open() {
            try {
                //cria conexão usando pqxx
                conn = std::make_unique<pqxx::connection>(connectionString);

                //msg de deu certo
                if (conn -> is_open()) {
                    std::cout << "Conectado ao postgreSQL: " << conn->dbname() << std::endl;
                    return true;
                }
            } catch(const std::exception& e) {
                //msg de erro
                std::cerr << "Erro ao conectar ao PostgreSQL: " << e.what() << std::endl;
            }
            return false;
        }

        //metodo para o model pegar conexão
        pqxx::connection& getConnection() {
            return *conn;
        }
};