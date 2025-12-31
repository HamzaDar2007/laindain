import { Account, AccountType } from '../store/accounts/accountsTypes';

/**
 * Generates account code in format: 0-00-000-0000
 * Level 1: 1-00-000-0000 (Assets), 2-00-000-0000 (Liabilities), etc.
 * Level 2: 1-01-000-0000, 1-02-000-0000
 * Level 3: 1-01-001-0000, 1-01-002-0000
 * Level 4: 1-01-001-0001, 1-01-001-0002
 */

// Map account types to level 1 codes
const typeToLevel1Code: Record<AccountType, number> = {
    [AccountType.ASSET]: 1,
    [AccountType.LIABILITY]: 2,
    [AccountType.EQUITY]: 3,
    [AccountType.REVENUE]: 4,
    [AccountType.EXPENSE]: 5,
};

export function generateAccountCode(
    level: number | string,
    type: AccountType,
    parentCode: string | null,
    existingAccounts: Account[]
): string {
    const numericLevel = typeof level === 'string' ? parseInt(level, 10) : level;
    if (numericLevel === 1) {
        // Level 1: X-00-000-0000
        const typeCode = typeToLevel1Code[type];
        return `${typeCode}-00-000-0000`;
    }

    if (!parentCode) {
        throw new Error('Parent code is required for levels 2-4');
    }

    const parts = parentCode.split('-');

    if (numericLevel === 2) {
        // Level 2: X-YY-000-0000
        const level1Code = parts[0];
        const nextLevel2 = getNextCodeAtLevel(existingAccounts, numericLevel, parentCode);
        return `${level1Code}-${padNumber(nextLevel2, 2)}-000-0000`;
    }

    if (numericLevel === 3) {
        // Level 3: X-YY-ZZZ-0000
        const level1Code = parts[0];
        const level2Code = parts[1];
        const nextLevel3 = getNextCodeAtLevel(existingAccounts, numericLevel, parentCode);
        return `${level1Code}-${level2Code}-${padNumber(nextLevel3, 3)}-0000`;
    }

    if (numericLevel === 4) {
        // Level 4: X-YY-ZZZ-WWWW
        const level1Code = parts[0];
        const level2Code = parts[1];
        const level3Code = parts[2];
        const nextLevel4 = getNextCodeAtLevel(existingAccounts, numericLevel, parentCode);
        return `${level1Code}-${level2Code}-${level3Code}-${padNumber(nextLevel4, 4)}`;
    }

    throw new Error('Invalid level. Must be 1-4');
}

function getNextCodeAtLevel(
    accounts: Account[],
    numericLevel: number,
    parentCode: string
): number {
    // Filter accounts that are children of the parent
    const siblings = accounts.filter((acc) => {
        const accLevel = typeof acc.level === 'string' ? parseInt(acc.level, 10) : acc.level;
        if (numericLevel === 2) {
            // Level 2 accounts have same first part
            return accLevel === numericLevel && acc.code.startsWith(parentCode.split('-')[0]);
        }
        if (numericLevel === 3) {
            // Level 3 accounts have same first two parts
            const parentParts = parentCode.split('-');
            return (
                accLevel === numericLevel &&
                acc.code.startsWith(`${parentParts[0]}-${parentParts[1]}`)
            );
        }
        if (numericLevel === 4) {
            // Level 4 accounts have same first three parts
            const parentParts = parentCode.split('-');
            return (
                accLevel === numericLevel &&
                acc.code.startsWith(`${parentParts[0]}-${parentParts[1]}-${parentParts[2]}`)
            );
        }
        return false;
    });

    if (siblings.length === 0) {
        return 1;
    }

    // Get the maximum code number at this level
    const maxCode = Math.max(
        ...siblings.map((acc) => {
            const parts = acc.code.split('-');
            return parseInt(parts[numericLevel - 1], 10);
        })
    );

    return maxCode + 1;
}

function padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
}

// Validate account code format
export function validateAccountCode(code: string): boolean {
    const pattern = /^\d-\d{2}-\d{3}-\d{4}$/;
    return pattern.test(code);
}

// Parse account code to get level information
export function parseAccountCode(code: string): {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
} {
    const parts = code.split('-');
    return {
        level1: parseInt(parts[0], 10),
        level2: parseInt(parts[1], 10),
        level3: parseInt(parts[2], 10),
        level4: parseInt(parts[3], 10),
    };
}

// Get account level from code
export function getAccountLevelFromCode(code: string): number {
    const parsed = parseAccountCode(code);

    if (parsed.level4 !== 0) return 4;
    if (parsed.level3 !== 0) return 3;
    if (parsed.level2 !== 0) return 2;
    return 1;
}
