( () => {
    const createNode = ( tagName, className ) => {
        const node = document.createElement( tagName );

        if ( className ) {
            node.classList.add( className );
        }

        return node;
    };

    class Gallery {
        constructor( imageFinder ) {
            this._imageFinder = imageFinder;
            this._createInterface();
            this._setFunctionality();
        }

        _createInterface() {
            this._viewNode = createNode( 'div', 'gallery' );
            this._resultsNode = createNode( 'div', 'galleryItems' );
            this._controlsNode = createNode( 'div', 'galleryControls' );
            this._queryInputNode = createNode( 'input' );
            this._searchBtnNode = createNode( 'button', 'search' );
            this._searchBtnNode.innerText = 'Search';



            this._viewNode.appendChild( this._controlsNode );
            this._controlsNode.appendChild( this._queryInputNode );
            this._controlsNode.appendChild( this._searchBtnNode );
            this._controlsNode.appendChild( this._createSearchDropDown() );
            this._viewNode.appendChild( this._resultsNode );
        }

        _createSearchDropDown() {
            let select = createNode( 'select', 'changeSearchModule' );

            [ {
                value: "static",
                text: "Static"
            }, {
                value: "flickr",
                text: "Flickr"
            } ].forEach( ( {
                value,
                text
            } ) => select.appendChild( this._createSearchOption( value, text ) ) );


            this._changeSearchMethodNode = select;
            return select;
        }

        _createSearchOption( value, text ) {
            let option = createNode( 'option' );
            option.value = value;
            option.text = text;
            return option;
        }

        _setFunctionality() {
            this._searchBtnNode.addEventListener( 'click', () => this._onSearchButtonClick() );
        }

        _onSearchButtonClick() {
            this.doSearch( this._queryInputNode.value, this._changeSearchMethodNode.value );
        };

        _onSearchResultReady( {
            images
        } ) {
            this._resultsNode.innerHTML = '';
            const fragmentWithResults = images.reduce( ( fragment, image ) => {
                const imgNode = createNode( 'img' );
                imgNode.setAttribute( 'src', image.url );
                fragment.appendChild( imgNode );
                return fragment;
            }, document.createDocumentFragment() );

            this._resultsNode.appendChild( fragmentWithResults );
        }

        doSearch( query, method ) {
            const searchResults = this._imageFinder.search( query, method );
            searchResults.then( searchResults => this._onSearchResultReady( searchResults ) );
        }

        addToNode( node ) {
            node.appendChild( this._viewNode );
        }
    }

    window.classes = window.classes || {};
    window.classes.Gallery = Gallery;
} )();