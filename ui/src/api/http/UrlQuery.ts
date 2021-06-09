class UrlQuery {
    private queryParams = new Map<string, string | number>();

    public setParam(key: string, value: string | number): Map<string, string | number> {
        return this.queryParams.set(key, value);
    }

    public deleteParam(key: string): boolean {
        return this.queryParams.delete(key);
    }

    public setPagination(startIndex: number, itemsPerPage: number): void {
        this.queryParams.set('startIndex', startIndex);
        this.queryParams.set('count', itemsPerPage);
    }

    public deletePagination(): void {
        this.queryParams.delete('startIndex');
        this.queryParams.delete('count');
    }

    public getQueryParams(): Map<string, string | number> {
        return this.queryParams;
    }

    public toString(): string | undefined {
        let queryString = '';
        this.queryParams.forEach( (value, key) => {
            if (queryString.length > 0) {
                queryString += '&'; 
            }
            queryString += key + '=' + value; 
        });
        return (queryString && queryString.length > 0) ? queryString : undefined;
    }
}

export default UrlQuery;
