class AuthorsController < ApplicationController
  def index
    render json:  Author.all.order('created_at DESC').includes(:books).to_json(only: [:name], include: [books: {only: :title}])    
      
  end

  def new
    @author = Author.new
    @author.books.build({author_id: @author.id})
    #@author.books.build
  end

  def create
    Author.create(author_params)
    redirect_to authors_path
  end

  #### TEST
  def edit
    @author = Author.first
  end

  def update
    @author = Author.update(author_params)

  end
  ####

  private
  def author_params
    params.require(:author).permit(:name, books_attributes:[:title])
  end
end

# module Api
#   module V1
#     class AuthorsController < ApplicationController
#       def index
#         @articles = Article.order('craeted_at DESC')
#         render json: { data: articles}, status: :ok
#       end
#     end
#   end
# end