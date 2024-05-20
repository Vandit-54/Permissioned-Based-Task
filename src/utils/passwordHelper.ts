import bcrypt from 'bcryptjs';

export async function passwordHelper(next: Function): Promise<void> {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const password = this.password;
  if (!password) {
    throw new Error("Password not provided");
  }
  this.password = await bcrypt.hash(this.password, salt);
  next();
}
