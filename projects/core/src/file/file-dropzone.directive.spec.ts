import { Component, DebugElement } from "@angular/core";
import { NgEzFileDropzoneDirective } from "./file-dropzone.directive";
import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
    selector: 'test',
    template: `<div ngezFileDropzone accept=".jpg"></div>`
})
class FileDropzoneTestComponent{}

describe('FileDropzoneDirective', () => {

    let directive: NgEzFileDropzoneDirective;
    let fixture: ComponentFixture<FileDropzoneTestComponent>;
    let debugElement: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FileDropzoneTestComponent, NgEzFileDropzoneDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(FileDropzoneTestComponent);
        debugElement = fixture.debugElement.query(By.directive(NgEzFileDropzoneDirective));
        directive = debugElement.injector.get(NgEzFileDropzoneDirective);
        fixture.detectChanges();
    });

    it('should be instantiated', () => {
        expect(directive).toBeDefined();
    });

    it('should pass the "accept" input', () => {
        expect(directive.accept).toBe('.jpg');
    });

    it('should set/remove the active class', () => {
        const target = {};
        expect(debugElement.classes.active).toBe(false);
        directive.onDragEnter(target);
        fixture.detectChanges();
        expect(debugElement.classes.active).toBe(true);
        directive.onDragLeave(target);
        fixture.detectChanges();
        expect(debugElement.classes.active).toBe(false);
    });

    it('should not set the active class while disabled', () => {
        const target = {};
        directive.setDisabledState(true);
        directive.onDragEnter(target);
        fixture.detectChanges();
        expect(debugElement.classes.active).toBe(false);
    });

    it('should set the dropped files as the value', (done) => {
        const dt = new DataTransfer();

        const files = [
            new File(["blob"], "song.mp3", { type: 'audio/mp3' }),
            new File(["blob"], "99872_n.jpg", { type: 'image/jpeg' }),
            new File(["blob"], "asdf.txt", { type: 'text/plain' })
        ];

        files.forEach(file => dt.items.add(file));

        const event = {
            dataTransfer: dt,
            stopPropagation: function(){},
            preventDefault: function(){}
        };

        spyOn(directive as any, 'getFilesFromDataTransferItemList').and.returnValue(Promise.resolve(files));

        directive.onDrop(event).then(() => {
            expect(directive.value).toEqual(files);
            done();
        });        
    })
});