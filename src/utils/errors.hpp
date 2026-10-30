#pragma once

#include <stdexcept>
#include <string>

//pega os erros tipo no AppError do node
class AppError : public std::runtime_error {
    private:
        std::string errorCode;

    public:
        AppError(const std::string& code, const std::string& message)
            : std::runtime_error(message), errorCode(code) {}

        const std::string& code() const { return errorCode; }
};