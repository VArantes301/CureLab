#pragma once

#include <cstdlib> //std::getenv
#include <fstream> // le arquivo
#include <iostream>
#include <string>
#include <unordered_map>

class Env {
    private:
        //dicionario chave -> valor
        std::unordered_map<std::string, std::string> values;

        static std::string trim(const std::string& s) {
            const char* ws = " \t\r\n";
            size_t start = s.find_first_not_of(ws);
            if (start == std::string::npos) return "";
            size_t end = s.find_last_not_of(ws);
            return s.substr(start, end -start + 1);
        }

    public:
        bool load(const std::string& path = ".env") {

            //ve se acha o arquivo
            std::ifstream file(path);
            if (!file.is_open()) {
                std::cerr << "nao foi possivel abrir" << path << std::endl;
                return false;
            }

            std::string line;
            while (std::getline(file, line)) {
                line = trim(line);

                //ignora linhas vazias e comentarios
                if (line.empty() || line[0] == '#') continue;

                //se senha tiver = ele divide entre ela e o sinal
                size_t pos = line.find('=');
                if (pos == std::string::npos) continue;

                std::string key = trim(line.substr(0, pos));
                std::string value = trim(line.substr(pos + 1));

                //tira aspas
                if (value.size() >= 2 && value.front() == '"' && value.back() == '"') {
                    value = value.substr(1, value.size() - 2);

                }
                values[key] = value;

            }
            return true;
        }

        //busca o valor
        std::string get(const std:: string& key, const std::string& fallback = "") const {
            if (const char* sys = std::getenv(key.c_str())) return sys;
            auto it = values.find(key);
            if (it != values.end()) return it->second;
            return fallback;
        }
};