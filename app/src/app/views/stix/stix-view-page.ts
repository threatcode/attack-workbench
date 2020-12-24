import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StixObject } from 'src/app/classes/stix/stix-object';

@Component({template: ''})
export abstract class StixViewPage {
    //configuration for the view page behavior
    @Input() public config: StixViewConfig;

    //outputs to use if config.sidebarControl == "events"
    @Output() public onOpenHistory = new EventEmitter();
    public openHistory():void { this.onOpenHistory.emit(); }
    @Output() public onOpenNotes = new EventEmitter();
    public openNotes(): void { this.onOpenNotes.emit(); }
}

export interface StixViewConfig {
    /* What is the current mode? Default: 'view
    *    view: viewing the object
    *    edit: editing the object
    *    diff: displaying the diff between two STIX objects. If this mode is selected, two StixObjects must be specified in the objects field
    */
    mode?: "view" | "diff" | "edit";
    /* The object to show on the page
     * Note: if mode is diff, pass an array of two objects to diff
     */
    object: StixObject | [StixObject, StixObject]
    /* if true or omitted, show relationships with the object on the page. If false, omit the relationships */
    showRelationships?: boolean;
    /* is the current page editable? 
     * if true or omitted, include edit elements on the page such as buttons to add a relationship
     * if false, hide such elements
     */
    editable?: boolean;
    /* How should control of the sidebar be configured? Default if omitted is "service"
     * if "disable", sidebar-related controls should not be present
     * if "events", sidebar-related controls should be passed as an @output event.
     * if "service", use sidebar.service to control the sidebar
     */
    sidebarControl?: "disable" | "events" | "service"
}