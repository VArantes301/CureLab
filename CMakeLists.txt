cmake_minimum_required(VERSION 3.21)
project(curelab_server CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Crow CONFIG REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)
find_package(libpqxx CONFIG REQUIRED)
find_package(unofficial-sodium CONFIG REQUIRED)

file(GLOB_RECURSE SOURCES CONFIGURE_DEPENDS src/*.cpp)
add_executable(curelab_server ${SOURCES})

target_include_directories(curelab_server PRIVATE src)

target_link_libraries(curelab_server PRIVATE
    Crow::Crow
    nlohmann_json::nlohmann_json
    libpqxx::pqxx
    unofficial-sodium::sodium
)