import HelpBoard from "../../../elements/pages/helpBoard";
import Logo from "../../../elements/pages/fpLogo";
import feedData from "../../../fixtures/inputValues.json";

describe("FightPandemics Help Board Page for unauthorized user", () => {
  const helpBoard = new HelpBoard();
  const logo = new Logo();
  var noPostsAvailableText =
    "Sorry, there are currently no relevant posts available. Please try using a different filter search or ";
  var authorTitleText = "Sourced by FightPandemics";
  var errorMessageText = "Min. 2 characters";

  context("User opens Help Board", () => {
    beforeEach(() => {
      helpBoard.visit();
    });

    it("FP logo is visible and clickable", () => {
      cy.checkFpLogoIsVisibleAndClickable(logo.getFpLogoLocator());
    });

    it("Unauthorized user is redirected to SignIn page when clicking Add Post Button", () => {
      helpBoard.getAddPostButton().click({ force: true });
      cy.validateCorrectScreenIsOpen("auth/login");
    });

    it("keyword search Icon is visible and clickable", () => {
      var searchIcon = cy.get(helpBoard.getKeywordSearchButton());
      searchIcon
        .should("be.visible")
        .and("have.attr", "alt", "Icon")
        .click({ multiple: true, force: true });
      //cy.keywordSearchIconIsVisibleAndClickable(helpBoard.keywordSearchButton);
    });

    it(" clicking on search icon, link for typing opens", () => {
      searchIcon().click({ multiple: true, force: true });
      cy.get(helpBoard.getKeywordSearchLink())
        .should("be.visible")
        .and("have.attr", "type", "text");
    });

    it("Unauthorized user can search posts by typing name of an user", () => {
      searchLinkForPosts().type(feedData.searchByName);
      searchIcon().click({
        multiple: true,
        force: true,
      });
      cy.get(helpBoard.getAuthorTitle()).contains(authorTitleText);
    });

    it.skip("Unauthorized user if type single character for search", () => {
      searchLinkForPosts().type(feedData.searchBySingleCharacter);
      searchIcon().click({
        multiple: true,
        force: true,
      });
      //cy.get(helpBoard.getAuthorTitle()).contains(authorTitleText);
      cy.get(helpBoard.getErrorMessage()).contains("small", errorMessageText);
    });

    it.skip("No post appear if unauthorized user search posts by typing misspelled name", () => {
      searchLinkForPosts().type(feedData.searchByMisspelledText);
      searchIcon().click({
        multiple: true,
        force: true,
      });
      //cy.get(helpBoard.getAuthorTitle()).contains(authorTitleText);
      //cy.get(helpBoard.getAddPostLinkElement());
      cy.get(helpBoard.getNoPostsAvailableTextElement()).contains(
        noPostsAvailableText,
      );
    });

    it.skip("Help Board is empty - Unauthorized user is redirected to SignIn page when clicking Add Post link", () => {
      //there is no post on the Help Board
      helpBoard.getNoPostsAvailableTextElement().contains(noPostsAvailableText);
      var addPostLink = helpBoard.getAddPostLinkElement();
      addPostLink.click({ force: true });
      cy.validateCorrectScreenIsOpen("auth/login");
    });
  });

  function searchIcon() {
    var searchIcon = cy.get(helpBoard.getKeywordSearchButton());
    searchIcon.should("be.visible").and("have.attr", "alt", "Icon");
    return searchIcon;
  }

  function searchLinkForPosts() {
    var searchLink = cy.get(helpBoard.getKeywordSearchLink());
    searchLink.should("be.visible").and("have.attr", "type", "text");
    return searchLink;
  }
});
