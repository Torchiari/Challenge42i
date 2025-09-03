export declare class ListTasksDto {
    page?: number;
    pageSize?: number;
    sort?: 'asc' | 'desc';
    search?: string;
    status?: 'all' | 'completed' | 'pending';
}
