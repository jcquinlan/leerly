import React, {useState, useMemo, useContext} from 'react';
import {useToasts} from 'react-toast-notifications';
import { useRouter } from 'next/router';
import useGuardAdminRoute from '../../hooks/useGuardAdminRoute';
import {
    Container,
    HeroWrapper,
    HeroContent,
    Divider,
    Title,
    Button,
    Input,
    Checkbox
} from '../../components/styled';
import TypeSelector from '../../components/TypeSelector';
import ArticleImageSelector from '../../components/ArticleImageSelector';
import AppContext from '../../contexts/appContext';
import {createNewArticle} from '../../services/articleService';

import TextareaAutosize from 'react-textarea-autosize';
import {unsplashImageToSimplifiedImage, triggerUnsplashDownload} from '../../services/unsplashService';

const testImage = {
    "id": "gWzTum_yMCg",
    "created_at": "2020-10-03T16:50:15-04:00",
    "updated_at": "2020-11-25T07:23:46-05:00",
    "promoted_at": null,
    "width": 7360,
    "height": 4912,
    "color": "#E7F7F8",
    "blur_hash": "LTH2N38^?bIT.8Di%NadD%o#RjkD",
    "description": null,
    "alt_description": null,
    "urls": {
        "raw": "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE4NTczNn0",
        "full": "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE4NTczNn0",
        "regular": "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjE4NTczNn0",
        "small": "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE4NTczNn0",
        "thumb": "https://images.unsplash.com/photo-1601758177266-bc599de87707?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE4NTczNn0"
    },
    "links": {
        "self": "https://api.unsplash.com/photos/gWzTum_yMCg",
        "html": "https://unsplash.com/photos/gWzTum_yMCg",
        "download": "https://unsplash.com/photos/gWzTum_yMCg/download",
        "download_location": "https://api.unsplash.com/photos/gWzTum_yMCg/download"
    },
    "categories": [],
    "likes": 111,
    "liked_by_user": false,
    "current_user_collections": [],
    "sponsorship": {
        "impression_urls": [
            "https://secure.insightexpressai.com/adServer/adServerESI.aspx?script=false&bannerID=7686957&rnd=[timestamp]&gdpr=&gdpr_consent=&redir=https://secure.insightexpressai.com/adserver/1pixel.gif"
        ],
        "tagline": "Pets Bring Us Together",
        "tagline_url": "https://www.chewy.com/?utm_source=unsplash&utm_medium=brand&utm_term=chewy-8&utm_content=gWzTum_yMCg",
        "sponsor": {
            "id": "21uOSEd-cSI",
            "updated_at": "2020-11-25T19:31:03-05:00",
            "username": "chewy",
            "name": "Chewy",
            "first_name": "Chewy",
            "last_name": null,
            "twitter_username": "chewy",
            "portfolio_url": "https://www.chewy.com/",
            "bio": "There are endless ways #PetsBringUsTogether. We’re just here to help.",
            "location": null,
            "links": {
                "self": "https://api.unsplash.com/users/chewy",
                "html": "https://unsplash.com/@chewy",
                "photos": "https://api.unsplash.com/users/chewy/photos",
                "likes": "https://api.unsplash.com/users/chewy/likes",
                "portfolio": "https://api.unsplash.com/users/chewy/portfolio",
                "following": "https://api.unsplash.com/users/chewy/following",
                "followers": "https://api.unsplash.com/users/chewy/followers"
            },
            "profile_image": {
                "small": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
                "medium": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
                "large": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
            },
            "instagram_username": "chewy",
            "total_collections": 0,
            "total_likes": 0,
            "total_photos": 50,
            "accepted_tos": true
        }
    },
    "user": {
        "id": "21uOSEd-cSI",
        "updated_at": "2020-11-25T19:31:03-05:00",
        "username": "chewy",
        "name": "Chewy",
        "first_name": "Chewy",
        "last_name": null,
        "twitter_username": "chewy",
        "portfolio_url": "https://www.chewy.com/",
        "bio": "There are endless ways #PetsBringUsTogether. We’re just here to help.",
        "location": null,
        "links": {
            "self": "https://api.unsplash.com/users/chewy",
            "html": "https://unsplash.com/@chewy",
            "photos": "https://api.unsplash.com/users/chewy/photos",
            "likes": "https://api.unsplash.com/users/chewy/likes",
            "portfolio": "https://api.unsplash.com/users/chewy/portfolio",
            "following": "https://api.unsplash.com/users/chewy/following",
            "followers": "https://api.unsplash.com/users/chewy/followers"
        },
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1600206400067-ef9dc8ec33aaimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
        "instagram_username": "chewy",
        "total_collections": 0,
        "total_likes": 0,
        "total_photos": 50,
        "accepted_tos": true
    },
    "tags": [
        {
            "type": "landing_page",
            "title": "dog",
            "source": {
                "ancestry": {
                    "type": {
                        "slug": "images",
                        "pretty_slug": "Images"
                    },
                    "category": {
                        "slug": "animals",
                        "pretty_slug": "Animals"
                    },
                    "subcategory": {
                        "slug": "dog",
                        "pretty_slug": "Dog"
                    }
                },
                "title": "Dog Images & Pictures",
                "subtitle": "Download free dog images",
                "description": "Man's best friend is something to behold in all forms: gorgeous Golden Retrievers, tiny yapping chihuahuas, fearsome pitbulls. Unsplash's community of incredible photographers has helped us curate an amazing selection of dog images that you can access and use free of charge.",
                "meta_title": "Dog Pictures | Download Free Images on Unsplash",
                "meta_description": "Choose from hundreds of free dog pictures. Download HD dog photos for free on Unsplash.",
                "cover_photo": {
                    "id": "tGBRQw52Thw",
                    "created_at": "2018-01-19T09:20:08-05:00",
                    "updated_at": "2020-10-28T01:08:13-04:00",
                    "promoted_at": "2018-01-20T05:59:48-05:00",
                    "width": 3264,
                    "height": 4896,
                    "color": "#F1F2F0",
                    "blur_hash": "LQDcH.smX9NH_NNG%LfQx^Rk-pj@",
                    "description": "Dog day out",
                    "alt_description": "short-coated brown dog",
                    "urls": {
                        "raw": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-1.2.1",
                        "full": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
                        "regular": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
                        "small": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
                        "thumb": "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max"
                    },
                    "links": {
                        "self": "https://api.unsplash.com/photos/tGBRQw52Thw",
                        "html": "https://unsplash.com/photos/tGBRQw52Thw",
                        "download": "https://unsplash.com/photos/tGBRQw52Thw/download",
                        "download_location": "https://api.unsplash.com/photos/tGBRQw52Thw/download"
                    },
                    "categories": [],
                    "likes": 448,
                    "liked_by_user": false,
                    "current_user_collections": [],
                    "sponsorship": null,
                    "user": {
                        "id": "toGyhBVt2M4",
                        "updated_at": "2020-11-05T00:06:39-05:00",
                        "username": "fredrikohlander",
                        "name": "Fredrik Öhlander",
                        "first_name": "Fredrik",
                        "last_name": "Öhlander",
                        "twitter_username": null,
                        "portfolio_url": null,
                        "bio": "fredrikohlander@gmail.com\r\n\r\n",
                        "location": "El Stockholmo, Sweden",
                        "links": {
                            "self": "https://api.unsplash.com/users/fredrikohlander",
                            "html": "https://unsplash.com/@fredrikohlander",
                            "photos": "https://api.unsplash.com/users/fredrikohlander/photos",
                            "likes": "https://api.unsplash.com/users/fredrikohlander/likes",
                            "portfolio": "https://api.unsplash.com/users/fredrikohlander/portfolio",
                            "following": "https://api.unsplash.com/users/fredrikohlander/following",
                            "followers": "https://api.unsplash.com/users/fredrikohlander/followers"
                        },
                        "profile_image": {
                            "small": "https://images.unsplash.com/profile-1530864939049-bcc82b6c41c2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
                            "medium": "https://images.unsplash.com/profile-1530864939049-bcc82b6c41c2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
                            "large": "https://images.unsplash.com/profile-1530864939049-bcc82b6c41c2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
                        },
                        "instagram_username": "fredrikohlander",
                        "total_collections": 10,
                        "total_likes": 36,
                        "total_photos": 152,
                        "accepted_tos": true
                    }
                }
            }
        },
        {
            "type": "landing_page",
            "title": "cat",
            "source": {
                "ancestry": {
                    "type": {
                        "slug": "images",
                        "pretty_slug": "Images"
                    },
                    "category": {
                        "slug": "animals",
                        "pretty_slug": "Animals"
                    },
                    "subcategory": {
                        "slug": "cat",
                        "pretty_slug": "Cat"
                    }
                },
                "title": "Cat Images & Pictures",
                "subtitle": "Download free cat images",
                "description": "9 lives isn't enough to capture the amazing-ness of cats. You need high-quality, professionally photographed images to do that. Unsplash's collection of cat images capture the wonder of the kitty in high-definition, and you can use these images however you wish for free.",
                "meta_title": "20+ Cat Pictures & Images [HD] | Download Free Images & Stock Photos on Unsplash",
                "meta_description": "Choose from hundreds of free cat pictures. Download HD cat photos for free on Unsplash.",
                "cover_photo": {
                    "id": "_SMNO4cN9vs",
                    "created_at": "2018-12-30T12:17:38-05:00",
                    "updated_at": "2020-10-28T01:20:32-04:00",
                    "promoted_at": "2019-01-01T05:23:58-05:00",
                    "width": 4000,
                    "height": 4000,
                    "color": "#E8C98D",
                    "blur_hash": "L012.;oL4=WBt6j@Rlay4;ay^iof",
                    "description": "Glow in the Dark",
                    "alt_description": "yellow eyes",
                    "urls": {
                        "raw": "https://images.unsplash.com/photo-1546190255-451a91afc548?ixlib=rb-1.2.1",
                        "full": "https://images.unsplash.com/photo-1546190255-451a91afc548?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
                        "regular": "https://images.unsplash.com/photo-1546190255-451a91afc548?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
                        "small": "https://images.unsplash.com/photo-1546190255-451a91afc548?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
                        "thumb": "https://images.unsplash.com/photo-1546190255-451a91afc548?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max"
                    },
                    "links": {
                        "self": "https://api.unsplash.com/photos/_SMNO4cN9vs",
                        "html": "https://unsplash.com/photos/_SMNO4cN9vs",
                        "download": "https://unsplash.com/photos/_SMNO4cN9vs/download",
                        "download_location": "https://api.unsplash.com/photos/_SMNO4cN9vs/download"
                    },
                    "categories": [],
                    "likes": 486,
                    "liked_by_user": false,
                    "current_user_collections": [],
                    "sponsorship": null,
                    "user": {
                        "id": "KlbPlQFM3j4",
                        "updated_at": "2020-11-04T14:31:28-05:00",
                        "username": "unlesbar",
                        "name": "Stephan Henning",
                        "first_name": "Stephan",
                        "last_name": "Henning",
                        "twitter_username": null,
                        "portfolio_url": null,
                        "bio": null,
                        "location": "Germany",
                        "links": {
                            "self": "https://api.unsplash.com/users/unlesbar",
                            "html": "https://unsplash.com/@unlesbar",
                            "photos": "https://api.unsplash.com/users/unlesbar/photos",
                            "likes": "https://api.unsplash.com/users/unlesbar/likes",
                            "portfolio": "https://api.unsplash.com/users/unlesbar/portfolio",
                            "following": "https://api.unsplash.com/users/unlesbar/following",
                            "followers": "https://api.unsplash.com/users/unlesbar/followers"
                        },
                        "profile_image": {
                            "small": "https://images.unsplash.com/profile-1531167540173-a920494357e7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
                            "medium": "https://images.unsplash.com/profile-1531167540173-a920494357e7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
                            "large": "https://images.unsplash.com/profile-1531167540173-a920494357e7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
                        },
                        "instagram_username": null,
                        "total_collections": 3,
                        "total_likes": 77,
                        "total_photos": 30,
                        "accepted_tos": true
                    }
                }
            }
        },
        {
            "type": "search",
            "title": "human"
        }
    ]
};

function SubmitPage () {
    useGuardAdminRoute();

    const router = useRouter();
    const {addToast} = useToasts();
    const {user} = useContext(AppContext);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [formState, setFormState] = useState({});
    const [image, setImage] = useState(null);
    const formIsFilled = useMemo(() => {
        return !!(formState.article && formState.url && image && formState.title && !!selectedTypes.length);
    }, [formState]);

    const handleClick = async () => {
        try {
            const article = await createNewArticle({
                added_by: user.uid,
                body: formState.article,
                url: formState.url,
                title: formState.title,
                free: formState.free || false,
                types: selectedTypes,
                image: unsplashImageToSimplifiedImage(image)
            });

            await triggerUnsplashDownload(image);

            addToast('Article submitted', {appearance: 'success'});
            router.push(`/articles/${article.id}`);
        } catch (error) {
            addToast('An error occurred', {appearance: 'error'});
        };
    };

    const handleSelectedType = (newType) => {
        const typeIsAlreadySelected = selectedTypes.includes(newType);
        if (typeIsAlreadySelected) {
            setSelectedTypes(selectedTypes.filter(type => type !== newType));
        } else {
            setSelectedTypes([...selectedTypes, newType]);
        }
    }

    const handleFormState = (event) => {
        const newState = {
            ...formState,
            [event.target.name]: event.target.value
        };
        setFormState(newState);
    }

    const handleCheckboxChange = (event) => {
        const newState = {
            ...formState,
            [event.target.name]: event.target.checked
        };
        setFormState(newState);
    }

    const textAreaStyles = {
        width: '100%',
        fontSize: '16px',
        padding: '15px',
        marginBottom: '30px',
        border: 'none',
        backgroundColor: '#eee',
        borderRadius: '8px'
    }

    return (
        <>
        <Container>
        <HeroWrapper>
            <HeroContent>
                <Title>submit article</Title>
            </HeroContent>
        </HeroWrapper>

        <Divider />

        <TypeSelector onSelect={handleSelectedType} selectedTypes={selectedTypes} />

        <ArticleImageSelector image={image} onSelectImage={(image) => setImage(image)} />

        <Input type="text" name="url" placeholder="url of original article" required onChange={handleFormState} />
        <Input type="text" name="title" placeholder="title of the article" required onChange={handleFormState} />
        <TextareaAutosize style={textAreaStyles} minRows={10} name='article' placeholder='the summarized, translated article' required onChange={handleFormState} />

        <div>
            <label for='free'>Article is free?</label>
            <Checkbox type='checkbox' name='free' checked={formState.free || false} onChange={handleCheckboxChange} />
        </div>

        <Button onClick={handleClick} disabled={!formIsFilled}>Submit article</Button>

        </Container>
        </>
    );
}

export default SubmitPage;
