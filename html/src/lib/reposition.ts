
	import type { ActionReturn } from "svelte/action";

	type RepositionParams = {
		handle?: HTMLElement | string;
		boundingBox?: HTMLElement;
		cursorOver?: string;
		cursorDragging?: string;
		x?: string;
		y?: string;
	};

	type RepositionAttributes = {
		'onfinish'?: (event: CustomEvent<{detail: {x: number, y: number}}>) => void;
		'onmove'?: (event: CustomEvent<{detail: {x: number, y: number}}>) => void;
	}
	export const reposition = (node: HTMLElement, params?: RepositionParams, ): ActionReturn<RepositionParams, RepositionAttributes > => {
		let handle: HTMLElement;

		if(params && params.handle) {
			if (typeof params.handle === "string") {
				handle = document.querySelector(params.handle) as HTMLElement;
			} else if (params.handle instanceof HTMLElement) {
				handle = params.handle;
			}
		} else handle = node;

		function handleMouseDown() {
			if(params && params.cursorDragging) {
				handle.style.cursor = params.cursorDragging;
			}
			
			handle.addEventListener("mouseup", handleMouseUp);
			

			document.addEventListener("mousemove", handleMouseMove);
		}

		function handleMouseUp() {
			if(params && params.cursorOver) {
				handle.style.cursor = params.cursorOver;
			}
			node.dispatchEvent(new CustomEvent("finish", { detail: { x: node.style.left, y: node.style.top } }));
			
			handle.removeEventListener("mouseup", handleMouseUp);

			document.removeEventListener("mousemove", handleMouseMove);
		}

		function handleMouseMove(event: MouseEvent) {
				const { movementX, movementY, shiftKey, buttons } = event;

				if( buttons !== 1  ) {
					// If the left mouse button is not pressed, do nothing
					handleMouseUp();
					// This will also remove the mousemove event listener
					return;
				}
				let deltaX = movementX;
				let deltaY = movementY;
				let boundingBox: HTMLElement | null = null;

				if (params && params.boundingBox) {
					boundingBox = params.boundingBox;
				} else boundingBox = window.document.body;


				const nodeBoundingBox = node.getBoundingClientRect();

				// Check if the node is inside the bounding box
				if (boundingBox) {
					const boundingBoxRect = boundingBox.getBoundingClientRect();

					// Adjust deltaX if movement exceeds bounding box horizontally
					if (nodeBoundingBox.left + deltaX < boundingBoxRect.left) {
						deltaX = boundingBoxRect.left - nodeBoundingBox.left;
					} else if (nodeBoundingBox.right + deltaX > boundingBoxRect.right) {
						deltaX = boundingBoxRect.right - nodeBoundingBox.right;
					}

					// Adjust deltaY if movement exceeds bounding box vertically
					if (nodeBoundingBox.top + deltaY < boundingBoxRect.top) {
						deltaY = boundingBoxRect.top - nodeBoundingBox.top;
					} else if (nodeBoundingBox.bottom + deltaY > boundingBoxRect.bottom) {
						deltaY = nodeBoundingBox.bottom - nodeBoundingBox.bottom;
					}

				}
				
				if(shiftKey){
					if(Math.abs(deltaX) > Math.abs(deltaY)){
						// Move only horizontally
						deltaY = 0;
					} else {
						// Move only vertically
						deltaX = 0;
					}
				}

				node.style.left = nodeBoundingBox.x + deltaX + "px";
				node.style.top = nodeBoundingBox.y + deltaY + "px";

				node.dispatchEvent(new CustomEvent("move", { detail: { x: node.style.left, y: node.style.top } }));
		}

		const bounds = node.getBoundingClientRect();

		// Clear these two values to avoid conflicts with the new position
		node.style.bottom = '';
		node.style.right = '';
		// and set the position to absolute to allow for free movement
		node.style.position = "absolute";

		// @ts-ignore
		handle.addEventListener("mousedown", handleMouseDown);
		// Keep the same position in case the element doesn't have positon absolute
		if(params && params.x && params.y) {
			node.style.left = params.x ;
			node.style.top = params.y;
		} else {
			node.style.left = bounds.x + "px";
			node.style.top = bounds.y + "px";
		}
		return {
			update: () => {},
			destroy: () => {
				handle.removeEventListener("mousedown", handleMouseDown);
			}
			
		};
	};
