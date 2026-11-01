/* ============================================================
   Code Manager â€” Cloud-synced access codes via JSONBin.io
   ============================================================
   SETUP INSTRUCTIONS (free, takes ~2 minutes):
   1. Go to https://jsonbin.io and create a FREE account
   2. Click "New Bin" â†’ paste: {"codes":[]}
   3. Set the bin to PRIVATE (recommended)
   4. Copy the Bin ID from the URL/dashboard
   5. Go to Account â†’ API Keys â†’ copy your Master Key
   6. Replace the two placeholder values below
   7. Do the same in LandingActivity.java in the Android app
   ============================================================ */

(function() {
    'use strict';

    // âš™ï¸ CONFIGURATION â€” set these at jsonbin.io (free)
    const JSONBIN_BIN_ID  = '6ae74ad4ac6210605a639913';   // â† Replace with your Bin ID
    const JSONBIN_API_KEY = '$2a$10$TPgfGaps0rPB/l0eEmyFIuqjSeMNxIKcnqTCGQf1ytW2gKOaFPDcK';   // â† Replace with your Master Key
    const JSONBIN_BASE    = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

    // Local cache to avoid redundant fetches within the same page session
    let cachedCodes = null;

    const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omits O, 0, I, 1

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Internal helpers
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    function generateRandomCode() {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        }
        return code;
    }

    function buildHeaders() {
        const h = { 'Content-Type': 'application/json' };
        if (JSONBIN_API_KEY && JSONBIN_API_KEY.length > 10) {
            h['X-Master-Key'] = JSONBIN_API_KEY;
        }
        return h;
    }

    function isConfigured() {
        return JSONBIN_BIN_ID.length > 10 && JSONBIN_API_KEY.length > 10;
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Cloud I/O
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    async function fetchCodes() {
        // Always try localStorage first so the page works even without network
        const localFallback = () => {
            try {
                return JSON.parse(localStorage.getItem('let_reviewer_codes') || '[]');
            } catch (_) { return []; }
        };

        if (!isConfigured()) {
            console.warn('CodeManager: JSONBin not configured â€” using localStorage only.');
            cachedCodes = localFallback();
            return cachedCodes;
        }

        try {
            const resp = await fetch(`${JSONBIN_BASE}/latest`, {
                headers: buildHeaders()
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            cachedCodes = (data.record && Array.isArray(data.record.codes))
                ? data.record.codes
                : [];
            // Keep localStorage in sync
            localStorage.setItem('let_reviewer_codes', JSON.stringify(cachedCodes));
            return cachedCodes;
        } catch (e) {
            console.error('CodeManager: fetchCodes failed, falling back to localStorage:', e);
            cachedCodes = localFallback();
            return cachedCodes;
        }
    }

    async function saveCodes(codes) {
        // Always persist locally
        try {
            localStorage.setItem('let_reviewer_codes', JSON.stringify(codes));
        } catch (_) {}

        if (!isConfigured()) {
            cachedCodes = codes;
            console.warn('CodeManager: JSONBin not configured â€” saved to localStorage only.');
            return false;
        }

        try {
            const resp = await fetch(JSONBIN_BASE, {
                method:  'PUT',
                headers: buildHeaders(),
                body:    JSON.stringify({ codes })
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            cachedCodes = codes;
            return true;
        } catch (e) {
            console.error('CodeManager: saveCodes cloud write failed:', e);
            return false;
        }
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Public API
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /** Generate a new unique 6-char code and save it to the cloud. */
    async function generateCode() {
        const codes = await fetchCodes();
        let newCode;
        do {
            newCode = generateRandomCode();
        } while (codes.some(item => item.code === newCode));

        codes.push({
            code:      newCode,
            generated: Date.now(),
            used:      false,
            usedAt:    null
        });

        await saveCodes(codes);
        return newCode;
    }

    /** Returns {valid, message}. Does NOT consume the code. */
    async function verifyCode(code) {
        const codes    = await fetchCodes();
        const codeItem = codes.find(item =>
            item.code.toUpperCase() === code.toUpperCase()
        );
        if (!codeItem) return { valid: false, message: 'Invalid code' };
        if (codeItem.used) return { valid: false, message: 'Code already used' };
        return { valid: true, message: 'Code is valid' };
    }

    /** Marks a code as used in the cloud. Returns true on success. */
    async function markCodeAsUsed(code) {
        const codes    = await fetchCodes();
        const codeItem = codes.find(item =>
            item.code.toUpperCase() === code.toUpperCase()
        );
        if (codeItem && !codeItem.used) {
            codeItem.used   = true;
            codeItem.usedAt = Date.now();
            await saveCodes(codes);
            return true;
        }
        return false;
    }

    /** Returns the full array of code objects. */
    async function getAllCodes() {
        return await fetchCodes();
    }

    /** Returns {total, active, used} counts. */
    async function getStats() {
        const codes = await fetchCodes();
        return {
            total:  codes.length,
            active: codes.filter(c => !c.used).length,
            used:   codes.filter(c =>  c.used).length
        };
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Export
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    window.CodeManager = {
        generateCode,
        verifyCode,
        markCodeAsUsed,
        getAllCodes,
        getStats,
        isConfigured
    };

})();

