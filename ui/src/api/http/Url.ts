import UrlQuery from "./UrlQuery";

//TODO read from the environment file
const envApiHostname = 'http://localhost:3100';

export interface UrlParams {
    urlPlaceholderValues?: Array<string>;
    hostname?: string;
    query?: string | UrlQuery;
}

class Url {

    private origin: string;
    private pathname: string;
    private urlQuery: UrlQuery = new UrlQuery();
    private urlPlaceholderValues?: string[];

    constructor(pathname: string, origin?: string) {
        this.pathname = pathname;
        this.origin = origin ?? (envApiHostname ?? '');
    }

    setUrlPlaceholderValues(values: string[]): void {
        this.urlPlaceholderValues = values;
    }

    setDefaultPagination(): void {
        this.urlQuery.setPagination(0, 10);
    }

    getUrlQuery(): UrlQuery {
        return this.urlQuery;
    }

    toString(): string {
        let url = this.origin + (this.pathname ?? '');
        const queryString = this.urlQuery.toString();
        if (queryString) {
            url += '?' + queryString;
        }
        return url;
    }
}

//helper functions are used to create the Url object in one line instead of
//usual way to create the object and then setting its props in several lines
//helper function to create Url object
export const createUrl =
    (
        path: string,
        params?: {
            pathPlaceholderValues?: string[];
            defaultPagination?: boolean;
        }
    ): Url => {
        const url = new Url(path);
        if (params?.pathPlaceholderValues) {
            url.setUrlPlaceholderValues(params.pathPlaceholderValues);
        }
        if (params?.defaultPagination) {
            url.setDefaultPagination();
        }
        return url;
    };

//helper function to create Url object with default pagination
export const createGetUrl = (path: string, pathPlaceholderValues?: string[]): Url => {
    return createUrl(path, {
        defaultPagination: true,
        pathPlaceholderValues: pathPlaceholderValues
    });
};

export default Url;
