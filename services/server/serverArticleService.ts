import { sbClient } from ".";

export const getArticles = async () => {
    return await sbClient
        .from('articles')
        .select()
        .order('added_at', {ascending: false})
        .limit(50);
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
    const response = await sbClient
        .from('articles')
        .update(data)
        .eq('id', articleId)
    
    console.log(response);

    return data;
}