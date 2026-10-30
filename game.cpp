#include <emscripten/emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
int check_choice(const char* expected, const char* chosen) {
    if (expected == nullptr || chosen == nullptr) {
        return 0;
    }
    const char* a = expected;
    const char* b = chosen;
    while (*a != '\0' && *b != '\0') {
        if (*a != *b) return 0;
        ++a;
        ++b;
    }
    return *a == '\0' && *b == '\0';
}

EMSCRIPTEN_KEEPALIVE
int check_count(int expected, int chosen) {
    return expected >= 1 && expected <= 5 && chosen == expected;
}

static int rescueScore = 0;

EMSCRIPTEN_KEEPALIVE
void reset_game() {
    rescueScore = 0;
}

EMSCRIPTEN_KEEPALIVE
void add_star() {
    rescueScore += 3;
}

EMSCRIPTEN_KEEPALIVE
int get_score() {
    return rescueScore;
}

}
