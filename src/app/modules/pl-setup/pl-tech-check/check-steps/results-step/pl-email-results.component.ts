import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserModel } from '@root/src/app/common/models/CurrentUserModel';
import { PLTechCheckService } from '../../pl-tech-check.service';

@Component({
    selector: 'pl-email-results',
    templateUrl: 'pl-email-results.component.html',
    styleUrls: ['./pl-email-results.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLEmailResultsComponent implements OnInit {
    public emailForm: FormGroup;
    private readonly emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(private dialogRef: MatDialogRef<PLEmailResultsComponent>,
                private techCheckService: PLTechCheckService,
                private snackBar: MatSnackBar,
                private currentUserModel: CurrentUserModel) { }

    ngOnInit() {
        let name = '';
        let email = '';
        const currentUser = (this.currentUserModel.user as any);
        if (currentUser.isAuthenticated) {
            name = currentUser.getName();
            email = currentUser.email;
        }
        this.emailForm = new FormGroup({
            name: new FormControl(name, [Validators.required]),
            email: new FormControl(email, [Validators.required, Validators.pattern(this.emailPattern)]),
            cc: new FormControl('', [this.multipleEmailValidator()]),
            comments: new FormControl(''),
            sendToSupport: new FormControl(true),
            scheduleMeeting: new FormControl(false),
        });
    }

    sendEmail(val) {
        if (this.emailForm.valid) {
            this.techCheckService.sendResultsEmail(val).subscribe(
                (data) => {
                    this.snackBar.open('Results email sent successfully.', 'Close', {
                        duration: 3000,
                    });
                    if (!!val.scheduleMeeting) {
                        window.open('https://timetrade.com/book/ZBDMN', '_blank');
                    }
                    this.dialogRef.close();
                },
                (error) => {
                    this.snackBar.open('Error while sending results email.', 'Close', {
                        duration: 3000,
                    });
                },
            );
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    onSentToSupportChanged() {
        if (!this.emailForm.value['sendToSupport']) {
            this.emailForm.patchValue({
                scheduleMeeting: false,
            });
        }
    }

    private multipleEmailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const items = control.value.split(',');
            const hasInvalid = items.some(item => !this.isEmail(item.trim()));
            return hasInvalid ? { invalidCC: true } : null;
        };
    }

    private isEmail(email) {
        return this.emailPattern.test(String(email).toLowerCase());
    }
}
