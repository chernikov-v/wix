( () => {
    const FLICKR_API_KEY = 'b394136d5dde8d9d0d4f8fc6685386e2';

    function guid() {
        function s4() {
            return Math.floor( ( 1 + Math.random() ) * 0x10000 )
                .toString( 16 )
                .substring( 1 );
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }


    function getParams( params ) {
        return Object.keys( params )
            .map( function( key ) {
                return key + '=' + params[ key ];
            } )
            .join( '&' )
    }


    const Static = ( query ) => {
        let images = window.data.staticImagesData || [];

        return Promise.resolve( {
            query: query,
            images: images.filter( ( {
                title
            } ) => title.indexOf( query ) >= 0 )
        } );

    };

    const Flickr = ( query ) => {

        return new Promise( ( resolve, reject ) => {
            var getPhotos = fetch( 'https://api.flickr.com/services/rest?' + getParams( {
                    sort: "relevance",
                    parse_tags: 1,
                    content_type: 7,
                    extras: "can_comment,count_comments,count_faves,description,isfavorite,license,media,needs_interstitial,owner_name,path_alias,realname,rotation,url_c,url_l,url_m,url_n,url_q,url_s,url_sq,url_t,url_z",
                    per_page: 10,
                    page: 2,
                    lang: "en-US",
                    text: query,
                    viewerNSID: "",
                    method: "flickr.photos.search",
                    csrf: "",
                    api_key: FLICKR_API_KEY,
                    format: "json",
                    hermes: 1,
                    hermesClient: 1,
                    reqId: 768e6601,
                    nojsoncallback: 1
                } ) )
                .then( response => response.json() )
                .then( ( {
                    photos: {
                        photo: images
                    }
                } ) => {

                    resolve( {
                        query,
                        images: images.map( image => {
                            let {
                                id,
                                title,
                                width_m: width,
                                height_m: height,
                                url_m: url,
                                media: componentType,
                                width_sq: iconUrl,
                                realname: originalFileName = ""
                            } = image;

                            return {
                                id,
                                url,
                                "type": "MediaItem",
                                width,
                                height,
                                componentType,
                                title,
                                "mediaType": "picture",
                                iconUrl,
                                originalFileName
                            }
                        } )
                    } );
                } )
                .catch( reject );
        } );


    };


    class ImageFinder {
        constructor() {
            this.addSearchModule( "static", Static );
            this.addSearchModule( "flickr", Flickr );
        }
        search( query, moduleId ) {
            let searchModule = null;
            try {
                searchModule = this.modules[ moduleId ];
                if ( !searchModule ) {
                    throw new Error( "No such module as " + moduleId )
                }
            } catch ( e ) {
                console.error( e );
            }
            return  searchModule ? searchModule( query ) : Promise.resolve( {
                query: query,
                images: []
            } );

           
        }


        addSearchModule( key, module ) {
            this.modules = this.modules || {};
            this.modules[ key ] = module;
        }

    }



    window.classes = window.classes || {};
    window.classes.ImageFinder = ImageFinder;
} )();