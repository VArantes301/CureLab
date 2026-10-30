#pragma once

#include <sodium.h> //hash
#include <optional>
#include <string>
#include <vector>

#include "../model/user.hpp"
#include "../utils/errors.hpp"
#include "../utils/strings.hpp"

struct CreateUserData {
    std::string name;
    std::string email;
    std::string password;
    std::string phone1;
    std::string phone2;
};

class UserService {
    private:
        UserModel& userModel;

        static std::string hashPassword(const std::string& password) {
            char hashed[crypto_pwhash_STRBYTES];

            int result = crypto_pwhash_str(
                hashed,
                password.c_str(), password.size(),
                crypto_pwhash_OPSLIMIT_INTERACTIVE, //tipo 10 rounds
                crypto_pwhash_MEMLIMIT_INTERACTIVE //custo de memoria
            );

            if (result != 0) {
                throw AppError("HASH_FAILED", "Could not hash password");
            }
            return std::string(hashed);
        }

        //compara se a senha ta certa
        static bool passwordMatches(const std::string& password, const std::string& storedHash) {
            return crypto_pwhash_str_verify(
                       storedHash.c_str(),
                       password.c_str(), password.size()) == 0;
        }

    public:
        explicit UserService(UserModel& model) : userModel(model) {
            if (sodium_init() < 0) {
                throw AppError("SODIUM_INIT_FAILED", "libsodium could not be initialized");
            }
        }

        User createUser(const CreateUserData& data) {

            //pede todas as informações
            if (data.name.empty() || data.email.empty() || data.password.empty()) {
                throw AppError("NAME_EMAIL_PASSWORD_REQUIRED", "Name, email and password are required");
            }

            const std::string normalizedEmail = normalize(data.email);

            if (userModel.findByEmail(normalizedEmail)) {
                throw AppError("EMAIL_ALREADY_EXISTS", "A user with this email already exists");
            }

            //manda o hash pro banco
            const std::string hashedPassword = hashPassword(data.password);

            return userModel.addUser(data.name, normalizedEmail, hashedPassword,
                                     data.phone1, data.phone2);
        }

        std::vector<User> listUser() {
            return userModel.findAll();
        }

        //indentifier e name or email
        User login(const std::string& identifier, const std::string& password) {
            if (identifier.empty() || password.empty()) {
                throw AppError("IDENTIFIER_PASSWORD_REQUIRED", "Identifier and password are required");
            }

            //vê se e email
            std::optional<User> found = userModel.findByEmail(normalize(identifier));

            //tenta por nome
            if (!found) {
                found = userModel.findByName(trimCopy(identifier));
            }

            //emiti erro
            if (!found) {
                throw AppError("INVALID_CREDENTIALS", "Invalid credentials");
            }

            User user = *found;

            //erro de senhas diferentes
            if (!passwordMatches(password, user.password)) {
                throw AppError("INVALID_CREDENTIALS", "Invalid credentials");
            }

            //apaga o hash
            user.password.clear();
            return user;
        }


        //os updates ai
        bool updateMascot(int userId, const std::string& mascot) {
            return userModel.updateMascot(userId, mascot);
        }

        bool updateAddiction(int userId, const std::string& addictionType) {
            return userModel.updateAddiction(userId, addictionType);
        }

        bool updatePhone1(int userId, const std::string& phone1) {
            return userModel.updatePhone1(userId, phone1);
        }

        bool updatePhone2(int userId, const std::string& phone2) {
            return userModel.updatePhone2(userId, phone2);
        }
};