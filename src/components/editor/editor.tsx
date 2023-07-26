import React, { useEffect, useState, useRef } from "react";

import "./editor.scss";

import CCLEditor from "./Lexical/Editor";

function Editor() {
	const ccDraftRef = useRef(null);
	const ccEditorToolbarLocationRef = useRef(null);

	const toolbarRef = useRef<HTMLDivElement>(null);

	const [domReady, setDomReady] = useState(false);

	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		setDomReady(true);
	}, []);

	return (
		<div>
			<div
				id="lbn__Core__KnowledgeBase__Editor__Toolbar__Portal"
				ref={ccEditorToolbarLocationRef}
			/>

			<div className={"lbn__core__knowledge-base__article-new__article-wrapper "}>
				<div
					className={
						"lbn__core__knowledge-base__article-new__article-wrapper-constrained-view " +
						(!expanded
							? "lbn__core__knowledge-base__article-new__article-wrapper-constrained-view__active"
							: "lbn__core__knowledge-base__article-new__article-wrapper-constrained-view__full-width")
					}
				>
					<div>
						<input
							className="lbn__core__knowledge-base__article-new__input"
							id="note-name"
							name="note-name"
							type="text"
							// value={noteName}
							// onChange={UpdateProjectName}
							placeholder="Note title"
						/>
					</div>

					<hr
						style={{
							border: "none",
							borderTop: "0.0625rem solid var(--color-border)",
						}}
					/>

					{domReady && (
						<div>
							<CCLEditor
								value={null}
								PatchContent={null}
								editable={true} // : boolean;
								setEditable={null} // : Function | null;
								showToolbar={true} // : boolean;
								placeholder={""} // : string;
								// tells us whether the view is default expanded or not

								expanded={expanded}
								ExpandToggle={setExpanded}

								ref={ccDraftRef}
								toolbarRef={ccEditorToolbarLocationRef}

								affirmateAction={() => {
									null;
								}} // : () => void;
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Editor;
