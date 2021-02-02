import { ValidatorFn, AbstractControl } from '@angular/forms';

export class VersionNumber {
    private _version = [];
    public get version(): string { return this.toString() }
    public set version(v: string) { this._version = v.split("."); }

    /**
     * Construct a new version number object
     * @param version version number as string, e.g "6.0.1". Must be a set of numbers separated by .s
     */
    constructor(version: string) {
        // TODO check string against regex
        this.version = version;
    }

    /**
     * Get the version number as a string
     */
    public toString(): string {
        return this._version.join(".");
    }

    /**
     * Return a new VersionNumber which has the next major version
     * @returns {VersionNumber} the next major version
     */
    public nextMajorVersion(): VersionNumber {
        let clone = JSON.parse(JSON.stringify(this._version));
        clone[0] = parseInt(clone[0]) + 1;
        clone[0] = clone[0].toString();
        for (let i = 1; i < clone.length; i++) clone[i] = 0; //zero out subsequent indexes
        return new VersionNumber(clone.join("."))
    }

    /**
     * Return a new VersionNumber which has the next major version
     * @returns {VersionNumber} the next major version
     */
    public nextMinorVersion(): VersionNumber {
        if (this.granularity < 2) {
            console.error(`cannot increment minor version of ${this.toString()}`)
            return this; //cannot increment
        }
        let clone = JSON.parse(JSON.stringify(this._version));
        clone[1] = parseInt(clone[1]) + 1;
        clone[1] = clone[1].toString();
        for (let i = 2; i < clone.length; i++) clone[i] = 0; //zero out subsequent indexes
        return new VersionNumber(clone.join("."))
    }

    /**
     * Get the level of granularity of the version. 
     * E.g 10.12.4 would have a granularity of 3, 
     * and 6.2 would have a granularity of 2
     * @returns {number} the level of granularity
     */
    public get granularity(): number {
        return this._version.length;
    }

    /**
     * Get the sub-version of the version number
     * @param index the index to get. E.g index of 2 with version 1.2.3.4 would return "3"
     */
    public getSubVersion(index: number) {
        if (index > this.granularity || index < 0) throw "cannot fetch sub-version, index out of bounds";
        return this._version[index];
    }

    /**
     * Compare this version number to another version number.
     * Note: higher granularity versions are considered by this implementation to be greater versions,
     * so 1.0.0.0 is greater than 1.0. 
     * @param {VersionNumber} that the version to compare to
     * @returns {number} 0 if the same, + if this is greater, - if that is greater
     */
    public compareTo(that: VersionNumber): number {
        //TODO test this
        for (let i = 0; i < Math.max(this.granularity, that.granularity); i++) {
            if (this.granularity == that.granularity && this.granularity < i) return 0; //same version
            if (this.granularity < i) return -1;
            if (that.granularity < i) return 1;
            if (this.getSubVersion(i) == that.getSubVersion(i)) continue;
            return this.getSubVersion(i) - that.getSubVersion(i);
        }
        return 0; //same version
    }
}

/**
 * form field validator checking if the version number is formatted correctly
 */
export function versionNumberFormatValidator(): ValidatorFn {
    const pattern = /^(\d+\.)*\d+$/;
    return (control: AbstractControl): {[key:string]: any} | null => {
        const valid = pattern.test(control.value);
        return !valid ? { "invalidVersionFormat": { value: control.value }} : null;
    }
}
/**
 * form field validator checking if the version has been incremented
 * @param previousVersion the version the object was previously, for comparison
 */
export function versionNumberIncrementValidator(previousVersion: VersionNumber): ValidatorFn {
    return (control: AbstractControl): {[key:string]: any} | null => {
        const valid = new VersionNumber(control.value).compareTo(previousVersion) > 0;
        return !valid ? { "versionNotIncremented": { value: control.value }} : null;
    }
}