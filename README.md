Rails offers the possibility to create nested forms. Consider for example an author associated to his books with a one-to-many association. We can produce a form to create an author and one or several books in the same form. By default, this is a static process: we can add several books, but the number of possible new associated books has to be declared in the controller.

With a bit of Vanilla Javascript, we can very simply add a book to the form on demand, “on the fly”. There are several ways to do this. We propose here to discover how to do this “manually”, without jQuery or any library, and then automatize the procedure with a small Javascript snippet.
Setup of the example

We setup a minimalistic example. Take two models Author and Book with respective attributes ‘name’ and ‘title’ of type string. Suppose we have a one-to-many association, where every book is associated with at most one author.

We build a nested form view served by the controller’s action authors#new . We run rails g model Author name and rails g model Book title author:references, add the has_may and accepts_nested_attributes_for methods to the Author model. This will make several additional methods available. Our models will look like:

```ruby
#author.rb
Class Author < ActiveRecord
  has_many :books
  accepts_nested_attributes_for :books
end#book.rb
Class Book
  belongs_to :author
end
```

We will need an Author controller with three methods, new , create and index. Only two files are needed in our minimalistic example:

- controllers/authors_controller.rb and
- views/authors/new.html.erb.

Our controller here should look like:

```ruby
#/controllers/authors_controller.rbclass AuthorsController < ApplicationController
  def new
    @author = Author.new
    @author.books.build(author_id = @author.id)
  end  def create
    author = Author.create(author_params)
    redirect_to authors_path
  end
  def index
    render json: Author.all.order(‘create_at DESC’)
                   .includes(:books)
                   .to_json(
                     only: [:name],
                     include: [books: {only: :title}]
                    )
  end
  def author_params
    params.require(:author).permit(:name, books_attributes[:title])
  end
end
```

The _authors#new_ action uses the collection.build() method that comes with the has_many method. It will return a new Book object that is linked to the Author object through a foreign key.

The last method _author_params_ is the strong params sanitization method: we pass an array of nested attributes for books, meaning that we can pass several books to an author.

The authors#index action lazily renders JSON to avoid extra coding.

Finally, we also need to set our routes: `resources :authors, only: [:index, :new, :create]`

# The nested form

We will use the gem Simple_Form to generate the form:

```ruby
#views/authors/new.html.erb<%= simple_form_for @author do |f| %>
  <%= f.input :name %>
  <%= f.simple_fields_for :books do |b| %>
    <div id=”select”>
      <fieldset data-fields="0">
        <%= b.input :title %>
      <% end%>
      </fieldset>
    </div>
  <%= f.button :submit %>
<% end%>
```

A _FormBuilder_ is associated with a model and allows you to generate fields associated with the model object through a block. The form builder associated to the model `@author=Author.new` will yield as the `f` variable the object’s field `@author.name`. To generate the associated model `Book` fields, we yield another form builder, `fields_for` , as the `b` variable for the associated model. The form builder `fields_for` parameters are what the `accepts_nested_attributes_for` methods expects. This time the model will be :books since we have the association `author.books` (for `has_many`). Furthermore, `fields_for` renders its block once for every element of the association.

We have wrapped the input into `fieldset` and `div` tags to help us with the Javascript part for selecting and inserting code as we will see later. We can also build a wrapper, as: `<%= b.input :name, wrapper: :dynamic_input %>` to further clean the code (see note at the end).

# First experiment

We can now start experimenting. We can make the form accept two new books when creating an form author with the code:

```ruby
# authors_controller
def new
  @author = Author.new
  @author.books.build
  @author.books.build
end
```

We navigate to the view _/authors/new_ and see 3 fields, one for the author’s name and two for a book’s title. When we submit the form, we inspect the logs and the hash params will appear, showing something as below:

```json
{"author" : {
  "name": “John”,
  "books_attributes" : [
    “0”: {"title": “RoR is great”},
    “1”: {"title": “Javascript is cool”}
  ]
 }
}
```

# New experiment

Back to our authors#new action, we just keep one @author.books.build, and then navigate back to _views/authors/new_

What if you copy the HTML fragment code with the fieldset tag inside the form tag and paste it just after? We do this in the browser’s console, choose ‘edit as HTML’ and copy/paste the code fragment in the same modal. We modify all the “0” into “1” in the pasted code. You should end up with the following code:

```html
<! — original fieldset section --><fieldset data-fields=”0" >
 <div=”” class=”input string optional author_books_title”>
 <label class=”string optional” for=”author_books_attributes_0_title”>Title</label>
 <input class=”string optional” type=”text” name=”author[books_attributes][0][title]” id=”author_books_attributes_0_title”>
</fieldset>
```

followed by a newly appended code just below with ‘0’ changed to ‘1’:

```html
<fieldset data-fields=”1" >
  <div=”” class=”input string optional author_books_title”>
    <label class=”string optional” for=”author_books_attributes_1_title”>Title</label>
    <input class=”string optional” type=”text” name=”author[books_attributes][1][title]” id=”author_books_attributes_1_title”>
</fieldset>
```

A new input for an additional book appears. We fill and submit this form, and yes, it works! We have registered a nested hash. Great, now all we have to do is to automate this manual process by Javascript.

# Javascript snippet

Firstly, add a button after the form in the ‘authors/new’ view. This button will trigger the insertion of a new field input for a book title. Add for example:

```html
<button id="”addBook”">Add more books</button>
```

Then the Javascript code. We locate the following code in, for example, the file _javascript/packs/addBook.js_:

```js
const addBook = ()=> {
  const createButton = document.getElementById(“addBook”);
  createButton.addEventListener(“click”, () => {
    const lastId = document.querySelector(‘#select’)
                    .lastElementChild.dataset.fields
    const newId = parseInt(lastId, 10) + 1;    const changeFieldsId = document
                            .querySelector(‘[data-fields=”0"]’)
                            .outerHTML
                            .replace(/0/g,newId)    document.querySelector(“#select”).insertAdjacentHTML(
        “beforeend”, changeFieldsId
    );
  });
}export { addBook }
```

Firstly, this code is wrapped by an event listener on the newly added button with ‘id#addBook’. Then, the code does the following:

- finds the last fieldset tag with the lastElementChild method read the dataset which contains the last index and incremente it,
- copies an HTML fragment of the form code, serialize it with outerHTML, and reindex it with a regex to replace all the “0”s with the new index we have just got,
- and injects into the DOM.

Et voilà!

> Note 1: Turbolinks
> With Rails 6, we use Turbolinks. We want to wait for Turbolinks to be loaded on the page to use our method. In the file javascript/packs/application.js, we add the condition:

```js
import { addBook } from ‘addBook’document addEventListener(‘turbolinks:load’, ()=> {
  if (document.querySelector(‘#select’)) {
    addBook()
  }
})
```

and we add `defer: true` in the file _/views/layouts/application.html.erb_.

````html
<%= javascript_pack_tag ‘application’, ‘data-turbolinks-track’: ‘reload’, defer:
true %> ```> This simple method can be easily adapted for more complex forms.
The most tricky part is probably the regex part, depending on the form and more
specifically on the naming. > Note 2: Simple Form input wrapper We can create a
custom Simple Form input wrapper: ```ruby
#/config/initializers/simple_form_bootstrap.rbconfig.wrappers :dynamic_input,
tag: 'div', class: 'form-group', error_class: 'form-group-invalid', valid_class:
'form-group-valid' do |b| b.use :html5 b.wrapper tag: 'div', html: {id:
"select"} do |d| d.wrapper tag: 'fieldset', html: { data: {fields: "0"}} do |f|
f.wrapper tag: 'div', class: "form-group" do |dd| dd.use :label dd.use :input,
class: "form-control" end end end end
````

so that we can simplify the form:

```ruby
<%= simple_form_for @author do |f| %>
  <%= f.input :name %>
  <%= f.simple_fields_for :books do |b| %>
    <%= b.input :title, wrapper: :dynamic_input %>
  <% end%>
  <%= f.button :submit %>
<% end%>
```
