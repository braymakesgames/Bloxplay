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

    getAccount(username) {
        return this.getAccounts().find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        );
    },

    createAccount(username, password) {
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

        if (!password || password.length < 6) {
            return {
                success: false,
                message: "Password must be at least 6 characters."
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

            // Prototype-only local password storage.
            // This is NOT suitable for a real online account system.
            password: password,

            bloxBux: 0,

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

    login(username, password) {
        const account = this.getAccount(username);

        if (!account) {
            return {
                success: false,
                message: "Account not found."
            };
        }

        if (account.password !== password) {
            return {
                success: false,
                message: "Incorrect password."
            };
        }

        this.setCurrentAccount(account.username);

        return {
            success: true,
            account: account
        };
    },

    logout() {
        localStorage.removeItem(this.currentKey);
    },

    getCurrentAccountData() {
        const username = this.getCurrentAccount();

        if (!username) {
            return null;
        }

        return this.getAccount(username);
    },

    getBloxBux() {
        const account = this.getCurrentAccountData();

        if (!account) {
            return 0;
        }

        return account.bloxBux || 0;
    },

    addBloxBux(amount) {
        const username = this.getCurrentAccount();

        if (!username) {
            return 0;
        }

        const accounts = this.getAccounts();

        const account = accounts.find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        );

        if (!account) {
            return 0;
        }

        account.bloxBux = (account.bloxBux || 0) + amount;

        this.saveAccounts(accounts);

        return account.bloxBux;
    },

    setBloxBux(amount) {
        const username = this.getCurrentAccount();

        if (!username) {
            return 0;
        }

        const accounts = this.getAccounts();

        const account = accounts.find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        );

        if (!account) {
            return 0;
        }

        account.bloxBux = Math.max(0, amount);

        this.saveAccounts(accounts);

        return account.bloxBux;
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
    }
};
