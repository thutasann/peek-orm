```bash
echo 'export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"' >> ~/.zshrc
echo 'export LDFLAGS="-L/opt/homebrew/opt/mysql-client/lib"' >> ~/.zshrc
echo 'export CPPFLAGS="-I/opt/homebrew/opt/mysql-client/include"' >> ~/.zshrc
source ~/.zshrc
```
