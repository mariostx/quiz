export enum QuestionType {
    'SINGLE_ANSWER_QUESTION' = 'SINGLE_ANSWER_QUESTION',
    'MULTIPLE_ANSWERS_QUESTION' = 'MULTIPLE_ANSWERS_QUESTION',
    'PICTURE_QUESTION' = 'PICTURE_QUESTION'
}

export enum QuestionStatus {
    'published' = 'published',
    'unpublished' = 'unpublished',
    'deleted' = 'deleted',
    'admin_deleted' = 'admin_deleted',
}

export interface IssueReport {
    reportDate: string;
    reporter?: string;
    issues: string;
    solved: boolean;
    solveDate?: string;
    solvedBy?: string;
    note?: string;
}

export interface CategoryDifficulty {
    name: string;
    difficulty: { 
        author?: number;
        users?: number;
    }
}

export interface Location {
    country?: string;
    city?: string;
    placeName?: string;
    schoolOrFaculty?: {
        name: string;
        class?: string;
    }
}

export interface Question {
    id?: number;
    author?: string;
    location: Location;
    groupName?: string;
    type: QuestionType;
    categories: string[];
    language: string;
    question: string;
    answers: string[];
    correctAnswers: number[];
    difficultyByCategory?: CategoryDifficulty[];
    difficulty: { 
        author?: number;
        users?: number;
    }
    created: string;
    modified?: string;
    status: QuestionStatus;
    approved?: string;
    isIssueRepported: boolean;
    issues: IssueReport[]
}

export interface QuestionGroup {
    id?: number;
    author?: string;
    location: Location;
    groupName?: string;
    language: string;
    categories: string[];
    type: QuestionType;
    questions: number[];
    difficultyByCategory?: CategoryDifficulty[];
    difficulty: { 
        author?: number;
        users?: number;
    }
    created: string;
    modified?: string;
}
