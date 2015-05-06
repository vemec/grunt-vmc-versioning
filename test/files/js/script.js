function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
}