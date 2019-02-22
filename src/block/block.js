/**
 * BLOCK: web-recipe-clipper
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import axios from 'axios';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { PlainText,RichText,MediaUpload,URLInputButton,URLInput } = wp.editor;
const { Button } = wp.components;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-web-recipe-clipper', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'web-recipe-clipper - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'web-recipe-clipper — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	attributes: {
		url: {
			type: 'string',
		},
		title: {
			type: 'string',
		},
		description: {
			type: 'string',
		},
		image: {
			type: 'string',
		},
		mediaID: {
			type: 'number',
		},
		mediaURL: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: ( props ) => {
		const {
			className,
			attributes: {
				url,
				title,
				description,
				mediaID,
				mediaURL,
				image,
				instructions,
			},
			setAttributes,
		} = props;
		console.log(title);
		const onChangeURL = ( value ) => {
			console.log(value);
		      axios({
        method: 'get',
        url: `https://www.leancodes.com/recipe-api/RecipeParser-master/parse.php?link=${ value }`
    	}).then(response => {
            console.log(response.data);
            setAttributes( { url: value, title: response.data.title, description: response.data.description, image: response.data.photo_url} );
    	});
  
    	};
    	const onSelectImage = ( media ) => {
			setAttributes( {
				mediaURL: media.url,
				mediaID: media.id,
			} );
		};	
    if(title != null){
    	console.log("loading...");
    	return (<div>
    		<PlainText
				value={ title }
				onChange={ ( content ) => setAttributes( { title: content } ) }
			/>
			<div className="recipe-image">
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes="image"
						value={ mediaID }
						render={ ( { open } ) => (
							<Button className={ mediaID ? 'image-button' : 'button button-large' } onClick={ open }>
								{ ! mediaID ? __( 'Upload Image', 'gutenberg-examples' ) : <img src={ mediaURL } alt={ __( 'Upload Recipe Image', 'gutenberg-examples' ) } /> }
							</Button>
						) }
					/>
				</div>
			<RichText
				value={ description }
				onChange={ ( content ) => setAttributes( { description: content } ) }
			/>	
			</div>
    		);
    }else{
		return (
			<URLInput
				className={ className }
				value={ url }
				onChange={onChangeURL}
			/>
		);
	}
	},


	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save( { attributes } ) {
		return <div className="recipe-card">
		<a href={ attributes.url }></a>
		<p>{attributes.title}</p>
		<p>{attributes.description}</p>
		</div>;
	}
} );
