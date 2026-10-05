const BlockPlayAccounts = {
    storageKey: "blockplayAccounts",
    currentKey: "blockplayCurrentAccount",

    getAccounts() {
        try {
            return JSON.parse(
                localStorage.getItem(this.storageKey) || "[]"
            );
        } catch {
            return [];
        }
    },

    saveAccounts(accounts) {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(accounts)
        );
    },

    getCurrentAccount() {
        return localStorage.getItem(this.currentKey);
    },

    setCurrentAccount(username) {
        localStorage.setItem(this.currentKey, username);
    },

    createAccount(username) {
        username = username.trim();

        if (username.length < 3) {
            return {
                success: false,
                message: "Username must be at least 3 characters."
            };
        }

        if (username.length > 20) {
            return {
                success: false,
                message: "Username must be 20 characters or less."
            };
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return {
                success: false,
                message: "Only letters, numbers, and _ are allowed."
            };
        }

        const accounts = this.getAccounts();

        const exists = accounts.some(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        );

        if (exists) {
            return {
                success: false,
                message: "That username already exists."
            };
        }

        const account = {
            username: username,
            games: [],
            friends: [],
            avatar: {
                skin: "default",
                shirt: "default",
                pants: "default"
            }
        };

        accounts.push(account);
        this.saveAccounts(accounts);
        this.setCurrentAccount(username);

        return {
            success: true,
            account: account
        };
    },

    searchAccounts(searchText) {
        const search = searchText
            .toLowerCase()
            .trim();

        if (!search) {
            return [];
        }

        return this.getAccounts().filter(account =>
            account.username
                .toLowerCase()
                .includes(search)
        );
    },

    getAccount(username) {
        return this.getAccounts().find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        );
    }
};
