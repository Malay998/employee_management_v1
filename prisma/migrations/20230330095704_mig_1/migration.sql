-- CreateTable
CREATE TABLE "Employee" (
    "emp_id" SERIAL NOT NULL,
    "emp_name" TEXT NOT NULL,
    "emp_email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dept_id" INTEGER,
    "isHod" BOOLEAN NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("emp_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "department_id" SERIAL NOT NULL,
    "dept_name" TEXT NOT NULL,
    "description" TEXT,
    "hod_id" INTEGER,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_emp_email_key" ON "Employee"("emp_email");

-- CreateIndex
CREATE UNIQUE INDEX "Department_dept_name_key" ON "Department"("dept_name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_hod_id_key" ON "Department"("hod_id");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "Department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_hod_id_fkey" FOREIGN KEY ("hod_id") REFERENCES "Employee"("emp_id") ON DELETE SET NULL ON UPDATE CASCADE;
