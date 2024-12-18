import { Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import * as moment from 'moment';
import { LoginComponent } from '../../auth/pages/login/login.component';
import { RegisterComponent } from '../../auth/pages/register/register.component';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { VerifyEmailComponent } from '../../auth/pages/verify-email/verify-email.component';
import { LOCALSTORAGE_TOKEN_NAME } from '../helpers/bloghub.config';
import { getUserDetails } from '../helpers/jwt.helper';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ResetPasswordComponent } from '../../auth/pages/reset-password/reset-password.component';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})

export class CommonFunction {

    constructor(
        private modalService: NgbModal,
    ) { }

    /**
     * Open Sign-in component.
     */
    openSignInComponent() {
        const modalRef = this.modalService.open(LoginComponent,
            {
                centered: true,
                backdropClass: 'white-backdrop',
                keyboard: false,
                size: 'md',
                windowClass: 'bh_modal_box',
                modalDialogClass: 'd-flex justify-content-center',
                animation: true,
                backdrop: 'static',
            }
        );
    }

    /**
     * Open Sign-up component.
     */
    openSignUpComponent() {
        const modalRef = this.modalService.open(RegisterComponent,
            {
                centered: true,
                backdropClass: 'white-backdrop',
                keyboard: false,
                size: 'md',
                windowClass: 'bh_modal_box',
                modalDialogClass: 'd-flex justify-content-center',
                animation: true,
                backdrop: 'static',
            }
        );
    }

    /**
     * Open Verify email component.
     */
    openVerifyEmailComponent(modalStatus) {
        const modalRef = this.modalService.open(VerifyEmailComponent,
            {
                centered: true,
                backdropClass: 'white-backdrop',
                keyboard: false,
                size: 'md',
                windowClass: 'bh_modal_box',
                modalDialogClass: 'd-flex justify-content-center',
                animation: true,
                backdrop: 'static',
            }
        );
        modalRef.componentInstance.modalStatus = modalStatus;
    }

    /**
     * Open Reset password component.
     */
    openResetPasswordComponent() {
        const modalRef = this.modalService.open(ResetPasswordComponent,
            {
                centered: true,
                backdropClass: 'white-backdrop',
                keyboard: false,
                size: 'md',
                windowClass: 'bh_modal_box',
                modalDialogClass: 'd-flex justify-content-center',
                animation: true,
                backdrop: 'static',
            }
        );
    }

    /**
     * Close all active modal box.
     */
    closeAllModalBox() {
        this.modalService.dismissAll();
    }

    checkWhiteSpace(event: any) {
        if (event && event.code === 'Space' && event.keyCode === 32) {
            event.preventDefault();
        }
    }

    validateImageFile(name: String) {
        let allowed_extensions = ['jpg', 'jpeg', 'png'];
        var ext = name.substring(name.lastIndexOf('.') + 1);
        if (allowed_extensions.lastIndexOf(ext.toLowerCase()) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Set error based on error code.
     * @param err - Error status code.
     */
    httpErrorType(err: any) {
        console.log(err);
        // switch (err.status) {
        //     case ERROR_CODE.ERROR_500:
        //         console.log(err);
        //         break;
        //     default:
        //     console.log(err);
        //         break;
        // }
    }

    /**
     * Scroll to top.
     */
    scrollToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    /**
     * Get moment date.
     * @param date - string.
     */
    getMomentDate(date) {
        if (!date) {
            return date;
        }
        // return moment(date.split('+')[0]).format('DD-MMM-YYYY hh:mm a');
        // return moment(date).format('DD-MMM-YYYY hh:mm a');
    }

    /** Copy to  Clipboard */
    copyToClipBoard(val) {
        if (val) {
            // tslint:disable-next-line: prefer-const
            let selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = val;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }
    }

    removeUnwantedKey(data) {
        const returnObj = {};
        if (!data && !this.isObject(data)) {
            return data;
        }
        Object.keys(data).forEach(key => {
            if (data[key] !== 'null' && data[key] !== '' && data[key] !== 'undefined' &&
                data[key] !== undefined && data[key] !== null && data[key] !== ' ') {
                returnObj[key] = data[key];
            }
        });
        return returnObj;
    }

    isObject(val) {
        return val instanceof Object;
    }

    getRand() {
        return Math.floor(Math.random() * 100000);
    }
}