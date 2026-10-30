#pragma once

#include <algorithm>
#include <cctype>
#include <string>

//função para emular o trim
inline std::string trimCopy(const std::string& s) {
    const char* ws = "\t\r\n"; //cria ponteiro

    
    size_t start = s.find_first_not_of(ws); //vai atrás da posição onde não tem caractere especificado
    if (start == std::string::npos) return ""; // retorna string vazia se não tiver nada
    size_t end = s.find_last_not_of(ws); // procura de tras pra frente
    return s.substr(start, end - start + 1); //tira as posições sem nada

}

//toLowerCase em C++
inline std::string toLowerCopy(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(),
                   [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return s;
}

//deixa normal a string
inline std::string normalize(const std::string& s) {
    return toLowerCopy(trimCopy(s));
}