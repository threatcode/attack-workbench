import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Technique } from 'src/app/classes/stix/technique';
import { StixViewPage } from '../../stix-view-page';

@Component({
  selector: 'app-technique-view',
  templateUrl: './technique-view.component.html',
  styleUrls: ['./technique-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechniqueViewComponent extends StixViewPage implements OnInit {

    // public editing: boolean = false;

    public get technique(): Technique { return this.config.object as Technique; }

    constructor(private route: ActivatedRoute, private ref: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        // this.route.queryParams.subscribe(params => {
        //     this.editing = params["editing"];
        // });
    }

    ngAfterContentChecked() {
        this.ref.detectChanges();
    }

    public showDomainField(domain: string, field: string): boolean {
        return this.technique.domains.includes(domain) && (this.technique[field].length > 0 || this.editing);
    }

    public showTacticField(tactic: string, field: string): boolean {
        return this.technique.tactics.includes(tactic) && (this.technique[field].length > 0 || this.editing);
    }
}
