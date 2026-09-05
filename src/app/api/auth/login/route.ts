if (!user.isAdmin) {
  const code = await createVerificationCode(user.id, "login");
  await sendVerificationEmail(email, code);
}

return NextResponse.json({
  userId: user.id,
  email: user.email,
  isAdmin: user.isAdmin,
});
