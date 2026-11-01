/* ============================================================
   Code Manager - Cloud-synced via JSONBin.io + localStorage fallback
   ============================================================ */

(function () {
    'use strict';

    const JSONBIN_BIN_ID  = '6ae74ad4ac6210605a639913';
    const JSONBIN_API_KEY = '$2a$10$TPgfGaps0rPB/l0eEmyFIuqjSeMNxIKcnqTCGQf1ytW2gKOaFPDcK';
    const JSONBIN_BASE    = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
    const STORAGE_KEY     = 'let_reviewer_codes';
    const CHARS           = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    function randomCode() {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        }
        return code;
    }

    function headers() {
        return {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_API_KEY
        };
    }

    // ── localStorage helpers ──────────────────────────────────
    function localLoad() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch (_) { return []; }
    }

    function localSave(codes) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(codes)); }
        catch (_) {}
    }

    // ── Cloud I/O ─────────────────────────────────────────────
    async function cloudFetch() {
        const res = await fetch(`${JSONBIN_BASE}/latest`, { headers: headers() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const codes = Array.isArray(data.record?.codes) ? data.record.codes : [];
        localSave(codes); // keep local in sync
        return codes;
    }

    async function cloudSave(codes) {
        const res = await fetch(JSONBIN_BASE, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ codes })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        localSave(codes);
    }

    // Try cloud, fall back to localStorage on failure
    async function fetchCodes() {
        try {
            return await cloudFetch();
        } catch (e) {
            console.warn('CodeManager: cloud fetch failed, using localStorage:', e.message);
            return localLoad();
        }
    }

    async function saveCodes(codes) {
        localSave(codes); // always save locally first
        try {
            await cloudSave(codes);
        } catch (e) {
            console.warn('CodeManager: cloud save failed:', e.message);
        }
    }

    // ── Public API (all async) ────────────────────────────────

    async function generateCode() {
        const codes = await fetchCodes();
        let code;
        do { code = randomCode(); }
        while (codes.some(c => c.code === code));

        codes.push({ code, generated: Date.now(), used: false, usedAt: null });
        await saveCodes(codes);
        return code;
    }

    async function verifyCode(code) {
        const codes = await fetchCodes();
        const item  = codes.find(c => c.code === code.toUpperCase().trim());
        if (!item)     return { valid: false, message: 'Invalid code' };
        if (item.used) return { valid: false, message: 'Code already used' };
        return { valid: true, message: 'Code is valid' };
    }

    async function markCodeAsUsed(code) {
        const codes = await fetchCodes();
        const item  = codes.find(c => c.code === code.toUpperCase().trim());
        if (item && !item.used) {
            item.used   = true;
            item.usedAt = Date.now();
            await saveCodes(codes);
            return true;
        }
        return false;
    }

    async function getAllCodes() {
        return await fetchCodes();
    }

    async function getStats() {
        const codes = await fetchCodes();
        return {
            total:  codes.length,
            active: codes.filter(c => !c.used).length,
            used:   codes.filter(c =>  c.used).length
        };
    }

    window.CodeManager = { generateCode, verifyCode, markCodeAsUsed, getAllCodes, getStats };

})();
