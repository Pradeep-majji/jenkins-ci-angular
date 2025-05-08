import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffPinChangerComponent } from './staff-pin-changer.component';
import { EmployeeService } from '../../services/employee.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Employee, Role } from '../../models/employee.interface';

describe('StaffPinChangerComponent', () => {
  let component: StaffPinChangerComponent;
  let fixture: ComponentFixture<StaffPinChangerComponent>;
  let employeeService: EmployeeService;

  const mockRole: Role = {
    roleId: 1,
    roleName: 'Staff',
    level: 1,
    createDate: '2024-01-01',
    createBy: 1,
    updateDate: '2024-01-01',
    updateBy: 1,
    isActive: true
  };

  const mockEmployees: Employee[] = [
    {
      empId: 1,
      empFirstName: 'John',
      empMiddleName: 'D',
      empLastName: 'Doe',
      empEmail: 'john.doe@example.com',
      pin: '1234',
      role: mockRole,
      createDate: '2024-01-01',
      createBy: 1,
      updateDate: '2024-01-01',
      updateBy: 1,
      isActive: true
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        StaffPinChangerComponent
      ],
      providers: [EmployeeService]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffPinChangerComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    expect(component.pinChangeForm.get('selectedStaff')).toBeTruthy();
    expect(component.pinChangeForm.get('newPin')).toBeTruthy();
    expect(component.pinChangeForm.get('managerPin')).toBeTruthy();
    expect(component.pinChangeForm.get('isManager')).toBeTruthy();
  });

  it('should load employees on init', () => {
    spyOn(employeeService, 'getAllEmployees').and.returnValue(of(mockEmployees));
    component.ngOnInit();
    expect(component.staffList.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading employees', () => {
    spyOn(employeeService, 'getAllEmployees').and.returnValue(throwError(() => new Error('Failed to load')));
    component.ngOnInit();
    expect(component.errorMessage).toBe('Failed to load employee list');
    expect(component.isLoading).toBeFalse();
  });

  it('should update PIN successfully', () => {
    spyOn(employeeService, 'updatePin').and.returnValue(of({ message: 'PIN updated successfully' }));
    spyOn(localStorage, 'getItem').and.returnValue('3'); // Mock manager level
    component.staffList = mockEmployees;
    component.pinChangeForm.patchValue({
      selectedStaff: '1',
      newPin: '1234',
      managerPin: '5678'
    });
    component.onChangePin();
    expect(component.apiMessage).toBe('PIN updated successfully');
    expect(component.isError).toBeFalse();
  });

  it('should handle unauthorized PIN update', () => {
    spyOn(employeeService, 'updatePin').and.returnValue(throwError(() => ({ status: 403 })));
    spyOn(localStorage, 'getItem').and.returnValue('3'); // Mock manager level
    component.staffList = mockEmployees;
    component.pinChangeForm.patchValue({
      selectedStaff: '1',
      newPin: '1234',
      managerPin: '5678'
    });
    component.onChangePin();
    expect(component.apiMessage).toBe('Unauthorized: Manager PIN incorrect');
    expect(component.isError).toBeTrue();
  });
});
