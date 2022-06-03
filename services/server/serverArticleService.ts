import { sbClient } from ".";

export const getArticles = async (filters: string[], query?: string) => {
    const req = sbClient
        .from('articles')
        .select()
        .contains('types', filters || [])
        .order('added_at', {ascending: false})
        .limit(50);

    if (query) {
        req.textSearch('body', query, {
            type: 'websearch'
        })
    }

    return await req;
}

export const getArticle = async (articleId: string) => {
    const data = await sbClient
        .from('articles')
        .select()
        .eq('id', articleId)
        .limit(1)
        .single();
    
    return data;
}

export const updateArticle = async (articleId: string, data: any) => {
    await sbClient
        .from('articles')
        .update(data)
        .eq('id', articleId)
    
    return data;
}

export const saveArticle = async (data: any) => {
    const response = await sbClient
        .from('articles')
        .insert([data]);
    
    return response;
}