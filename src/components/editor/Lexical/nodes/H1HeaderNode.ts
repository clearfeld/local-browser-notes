import { HeadingNode, SerializedHeadingNode } from "@lexical/rich-text";
import { EditorConfig } from "lexical";

export class CustomHeadingNode extends HeadingNode {
	static getType(): "custom-heading-node" {
		return "custom-heading-node";
	}

	static clone(node: CustomHeadingNode): CustomHeadingNode {
		return new CustomHeadingNode(node.getTag());
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = super.createDOM(config);
		dom.id = `${this.getTextContent()}-${Math.random().toString(36).slice(-5)}}`;
		return dom;
	}

	updateDOM(prevNode: CustomHeadingNode, dom: HTMLElement): boolean {
		const isUpdated = super.updateDOM(prevNode, dom);
		dom.id = `${this.getTextContent()}-${Math.random().toString(36).slice(-5)}}`;
		return isUpdated;
	}

	exportJSON(): SerializedHeadingNode {
		return {
			...super.exportJSON(),
			tag: this.getTag(),
			type: "heading",
			version: 1,
		};
	}

	static importJSON(serializedNode: SerializedHeadingNode): HeadingNode {
		const node = new HeadingNode(serializedNode.tag);
		node.setFormat(serializedNode.format);
		node.setIndent(serializedNode.indent);
		node.setDirection(serializedNode.direction);
		return node;
	}
}
