insert into "users" ("username", "hashedPassword")
values ('autodidact', '$argon2i$v=19$m=4096,t=3,p=1$h7icQD/xZr8akZsX+hNA0A$h68atJWyjvunAwNOpSpMfg9sPvoMQ6dKwoh0dJhurWA');

insert into "code-journal" ("html", "css","javascript","title","imageUrl","description","userId","shared","sharedEdit")
values ('hihi', 'cssv','javascriptv','titlev','https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80','descriptionv',1,true,false);

insert into "comments"("userId","comments")
values (1,'hihi')
