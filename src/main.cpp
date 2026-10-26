#include "crow.h" //configura as rotas as rotas 
#include "config/env.hpp"
#include "model/user.hpp"
#include "model/diary.hpp"

int main() {
    Env env;

    if (!env.load("../.env")) return 1;

    std::string connStr = "host=" + env.get("DB_HOST") +
                          " port=" + env.get("DB_PORT") +
                          " dbname=" + env.get("DB_NAME") +
                          " user=" + env.get("DB_USER") +
                          " password=" + env.get("DB_PASSWORD");

    Database db(connStr);
    if (!db.open()) return 1;

    UserModel userModel(db);
    userModel.createTable();

    DiaryModel diaryModel(db);
    diaryModel.createTable();

    crow::SimpleApp app;
    CROW_ROUTE(app, "/")([]() { return "CureLab C++ no ar"; });
    app.port(18080).run();
}