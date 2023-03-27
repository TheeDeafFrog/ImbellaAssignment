# ImbellaAssignment
Assignment completed for Imbella as part of hiring interview process. It's a simple storefront that sells emotions and character attributes. It's built using React Native and the content is managed on and provided by [Storyblok](https://www.storyblok.com/).

Thanks to Bing AI for the short stories and images.

## Running the app
`npm start` to open the expo interface. Use `w` to start the web server, otherwise scan the URL with Expo Go and experiment on your phone.

The web version (meant for visualizing changes in the Storyblok UI, it doesn't look very nice) is available at [imbella.kevinr.net](https://imbella.kevinr.net).

The web version is hosted on AWS using an S3 bucket and CloudFront, the CDK definition is [here](https://github.com/TheeDeafFrog/ImbellaAssignmentCDK). If you're me and have access to my AWS user credentials, you can run `npm run deploy:web` to easily build and deploy the latest version.

## Walkthrough
### What's Storyblok
Storyblok is a headless CMS. Essentially the content the content that is displayed is created and edited on Storyblok.
### Main features to demonstrate
* **The home page**: The home page is a generic 'Page' story which is built up of blocks. Blocks are components that are defined in Storyblok. There are 2 types of blocks used on the home page: ProductList and GenericText.
* **Products**: Each product is defined as a story, containing the details of the product. When viewing an individual product, all the details are fetched and displayed through the page. The product list however, is provided a list of products bu UUID which are then fetched from the Storyblok API to display them in a list where the can be selected.
  * *Improvement*: Products in a list are fetched individually using promises. It turns out, the Storyblok API allows to fetch multiple products in a single call by listing out the UUIDs.
* **Search**: The Storyblok API allows to search for stories, hence a search page is provided which takes a search string and uses the Storyblok `search_by` query attribute to search for products to display. The API returns the full details of the story and these are passed to a product list.
* **Slug Management**: Storyblok provides slugs for each story (like `product/adventure`). The frontend modifies the page pathname (on the web) to match the slug, allowing content to be navigated to directly ([try it](https://imbella.kevinr.net/product/adventure)). Content is also fetched by slug. The top level component stores the slug in its state, and provides a `setSlug` function through context. A child, like the top appbar, can then call `setSlug` and set it to whatever. The top component then fetches the story for that slug, passes the contents to map function and the story is rendered.
  * *Improvement*: I really should've used a proper router...
* **Map Function**: the [mapBlockToComponent](./src/util/componentMap.tsx) function takes the string name of a component (provided by the response from Storyblok) and maps it to the correct local component.
* **The Storyblok Bridge**: Storyblok displays the website in an iFrame as its being edited. The Storyblok Bridge allows the editor to communicate with the page, so when content is changed, the iFrame can be automatically refreshed.
  * *Improvement*: Storyblok also provides `_editable` keys in it's response, these should be added as HTML comments above the component for the storyblok UI to allow components to be clicked on within the iFrame to provide additional options. React does't directly provide the ability to insert HTML comments, and I didn't have the time to stuff around with DOM manipulation to get them inserted.

## Demo
[This commit (4ed12205535fa3e0fa7bc8fe99b9db16c50e0d70)](https://github.com/TheeDeafFrog/ImbellaAssignment/commit/4ed12205535fa3e0fa7bc8fe99b9db16c50e0d70) shows how easy it is to add a block for a button, which when clicked on will change the slug. The slug to change to is defined by Storyblok, where the story for the slug is also defined. The attributes for the block defined in Storyblok must match the props for the component/block in the codebase. And that's it.

Because of the generic Page story which is used for the home page, we can now easily add a button to the home page in the Storyblok UI and then also create a new generic page entirely in the Storyblok UI which can also have a button to link back home.

We can also easily add a link to the about page in the top appbar by the same setup, simply adding a button where it will set the slug to the about page.