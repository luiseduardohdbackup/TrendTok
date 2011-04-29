if(!String.prototype.pluralize) {
    String.prototype.pluralize = function(counter, plural) {
        return counter + ' ' + (counter == 1 ? this : plural || this + 's');
    };
}
