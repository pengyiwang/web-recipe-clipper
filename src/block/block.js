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
const { Button,Spinner } = wp.components;

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
	title: __( 'Web Recipe Clipper' ), // Block title.
	icon: 'carrot', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'web recipe clipper' ),
		__( 'wordpress recipe builder' ),
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
		ingredients: {
			type: 'array',
			source: 'children',
			selector: '.ingredients',
		},
		instructions: {
			type: 'array',
			source: 'children',
			selector: '.steps',
		},
		fetching: {
			type: 'string',
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
				image,
				ingredients,
				instructions,
				fetching,
			},
			setAttributes,
		} = props;
		console.log(ingredients);
		const onChangeURL = ( value ) => {
			console.log(value);
			setAttributes({fetching: true});
		      axios({
        method: 'get',
        url: `https://www.leancodes.com/recipe-api/RecipeParser-master/parse.php?link=${ value }`
    	}).then(response => {
            console.log(response.data);
            setAttributes( { url: value, title: response.data.title, description: response.data.description, image: response.data.photo_url, ingredients: response.data.ingredients[0].list.map(function(ingredient){
			 return '<li>'+ingredient+'</li>';
		}).join(''), instructions: response.data.instructions[0].list.map(function(instruction){
			 return '<p>'+instruction+'</p>';
		}).join(''), fetching: false} );
    	});
  
    	};
    	const onSelectImage = ( media ) => {
			setAttributes( {
				image: media.url
			} );
		};
		const onChangeIngredients = ( value ) => {
			setAttributes( { ingredients: value } );
		};
		const onChangeInstructions = ( value ) => {
			setAttributes( { instructions: value } );
		};	
    if(title != null && !fetching){
    	console.log("loading...");
    	return (<div>
    		<RichText
    			tagName="h2"
				value={ title }
				onChange={ ( content ) => setAttributes( { title: content } ) }
			/>
			<div className="recipe-image">
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes="image"
						value={ image }
						render={ ( { open } ) => (
							<Button className={ image ? 'image-button' : 'button button-large' } onClick={ open }>
								{ ! image ? __( 'Upload Image', 'gutenberg-examples' ) : <img src={ image } alt={ __( 'Upload Recipe Image', 'gutenberg-examples' ) } /> }
							</Button>
						) }
					/>
				</div>
			<RichText
				value={ description }
				onChange={ ( content ) => setAttributes( { description: content } ) }
			/>
			<h3>Ingredients</h3>
			<RichText
					tagName="ul"
					multiline="li"
					value={ ingredients }
					onChange={ onChangeIngredients }
					className="ingredients"
				/>	
				<h3>Instructions</h3>
				<RichText
					tagName="div"
					multiline="p"
					className="steps"
					placeholder="Write the instructions…"
					value={ instructions }
					onChange={ onChangeInstructions }
				/>
			</div>

    		);
    }else{
    	if(fetching){
    		return <div className="web-recipe-clipper is-loading">
					<Spinner />
				   <p>{ __( 'Loading…' ) }</p>
	</div>
    	}else{
		return (
			<URLInput
				className={ className }
				value={ url }
				onChange={onChangeURL}
			/>
		);
		}
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
