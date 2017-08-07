# Not Trac

This project isn't Trac.

## Disclaimer

This connects to WordPress.org's Trac instance via XML-RPC, and hence requires your username and password. You shouldn't trust my code, and you should carefully audit all code that handles your username and password before entering it into this application.

This especially applies if you're a committer. Your WordPress.org password controls your commit access to 28% of the web, be extremely cautious with it.

**THERE IS ZERO SUPPORT PROVIDED FOR THIS INTERFACE**. This is something I made for my own use. If it's useful to you, great; if not, also great.

## Running Locally

```sh
# Clone
git clone https://github.com/rmccue/not-trac.git
cd not-trac

# Install all dependencies:
npm install
cd proxy
composer install
cd ..

# Run the following two simultaneously (maybe in separate terminal sessions):
npm run start
cd proxy && php -S 0.0.0.0:3001
```

## License

Uh... ISC I guess?
