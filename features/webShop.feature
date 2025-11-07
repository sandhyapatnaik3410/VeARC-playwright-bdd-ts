Feature: Login functionality

  Background: Prerequisite
    When I navigate to a url
    Then click on the login link
    Given logged into the Demo Web Shop application of Tricentis
  #   When the user navigates to the "Shopping cart" page
  # When the user clears the cart
  #    Then the cart should be empty


  @UI
  Scenario: Verify user is able to checkout product
    When the user navigates to the "Books" link
    When I add "Computing and Internet" to the cart
    When I add "Computing and Internet" to the cart
    When the user navigates to the "Shopping cart" page
    Then the item name "Computing and Internet" should be visible in the Shopping Cart page
    # Then verify the cart should show 2 items
    Then I accept the terms and conditions
    Then I click on the checkout button
    Then I click on continue button
    Then I click on continue button
    Then I click on continue button
    Then I click on continue button
    Then I click on continue button
    Then I click on confirm button


