import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { EmployeeService } from '../../services/employee.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Employee, Role } from '../../models/employee.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let employeeService: EmployeeService;
  let router: Router;

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

  const mockEmployee: Employee = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [EmployeeService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    expect(component.loginForm.get('empId')).toBeTruthy();
    expect(component.loginForm.get('pin')).toBeTruthy();
  });

  it('should handle successful login', () => {
    spyOn(employeeService, 'getEmployeeById').and.returnValue(of(mockEmployee));
    spyOn(router, 'navigate');
    spyOn(localStorage, 'setItem');

    component.loginForm.patchValue({
      empId: '1',
      pin: '1234'
    });

    component.onSubmit();

    expect(localStorage.setItem).toHaveBeenCalledWith('empId', '1');
    expect(localStorage.setItem).toHaveBeenCalledWith('level', '1');
    expect(router.navigate).toHaveBeenCalledWith(['/staff-pin-changer']);
  });

  it('should handle invalid credentials', () => {
    spyOn(employeeService, 'getEmployeeById').and.returnValue(throwError(() => new Error('Not found')));

    component.loginForm.patchValue({
      empId: '1',
      pin: 'wrong'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should handle form validation', () => {
    component.loginForm.patchValue({
      empId: '',
      pin: ''
    });

    expect(component.loginForm.valid).toBeFalse();

    component.loginForm.patchValue({
      empId: '1',
      pin: '1234'
    });

    expect(component.loginForm.valid).toBeTrue();
  });

  it('should handle PIN validation', () => {
    component.loginForm.patchValue({
      empId: '1',
      pin: '123' // Too short
    });

    expect(component.loginForm.get('pin')?.valid).toBeFalse();

    component.loginForm.patchValue({
      empId: '1',
      pin: '1234' // Correct length
    });

    expect(component.loginForm.get('pin')?.valid).toBeTrue();
  });

  it('should handle employee ID validation', () => {
    component.loginForm.patchValue({
      empId: '0', // Invalid ID
      pin: '1234'
    });

    expect(component.loginForm.get('empId')?.valid).toBeFalse();

    component.loginForm.patchValue({
      empId: '1', // Valid ID
      pin: '1234'
    });

    expect(component.loginForm.get('empId')?.valid).toBeTrue();
  });
});
