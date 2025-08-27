/**
 * React hook that is used to mark the block wrapper element.
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function.
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 * @return {WPElement} Element to render.
 */
export default function Save({ attributes }) {
	const blockProps = useBlockProps.save();

	// The save function determines the static content that is stored in the post.
	// For a modern interactive block, we just save a container for our front-end script (`view.js`)
	// to attach to. We also save the block attributes, like the title.
	return (
		<div {...blockProps}>
			<RichText.Content
				tagName="h2"
				className="live-3d-terrain-aag__title"
				value={attributes.title}
			/>
			{/* This is the container where the view.js script will render the 3D scene. */}
			<div className="live-3d-terrain-aag__canvas-container">
				<div className="live-3d-terrain-aag__canvas" />
			</div>
		</div>
	);
}
