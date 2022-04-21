#fcia showResult berie jeden argument, parameter n -  pocet stien kolko obsahuje dana kocka
# fcia pre danu kocku s n stenami vygeneruje output v tvare 3 kategorii
#pcka - vypocitanych prvych n pociatocnych podmienok *p(n) v knihe
#lambdas - vysledky komplexnych korenov prislusnej charakteristickej fcie
# cecka - cecka, ktore splnaju rovnost pcka[i]=cecka*lambdas^i , pre i = 1,2,..,n 
# ak by sme chceli vysledky tak ako v knihe pre kocku so 6 stenami tak zavolame:
#kockaResult <- showResult(6)
#( dana fcia vykresluje body aj v komplexnej rovine )
  showResult <- function(n) {
    b <- c(rep(1/n,n))
    A <- matrix(nrow=n,ncol=n,byrow=TRUE)
    for (i in 1:n){
      A[i,]<- c(rep(-1/n,i-1),1,rep(0,n-1-(i-1)))
    }
    
    p <- backsolve(A, p <-  b, upper.tri = FALSE,
              transpose = FALSE)
    polyrootInput <- c(rep(-1/n,n),1)
    lambda <- polyroot(polyrootInput)
    plot(lambda,xlim=c(-1.2,1.2),ylim=c(-1.2,1.2), asp=1)
    curve(sqrt(1-x^2), from=-1, to=1, add=TRUE)
    curve(-sqrt(1-x^2), from=-1, to=1, add=TRUE)
    A<-matrix(nrow=n,ncol=n,byrow=TRUE)
    ai<-c()
    for (i in 1:n){
      ai<-lambda^i
      A[i,]<- ai
    }
    R <- list(cecka = solve(A,p), lambdas = lambda, pcka = p)
    return (R)
  }

#funkcia p sluzi na vypocitanie, konkretneho p(i) ako vstupne argumenty berie 
# n - kolkate konkretne p(n) chceme vypocitat
# lambdas - lambdy, ktore sme dostali z funkcie showResult()
# cecka - cecka, ktore sme dostali z funkcie showResult()
#Ak by sme chceli vediet p(20), pre typ kocky so 6 stenami, tak vykoname nasledovne:
#Zistime lambdy a cecka pre kocku so 6 stenami:
# kockaResult <- showResult(6)
#Potom vysledne lambdy a cecka z kockaResult zoberieme ako vstupne parametre do funkcie p
#p(20,normalKocka$lambdas,normalKocka$cecka)
  p <- function(n,kocka){
    lambdas <- kocka$lambdas
    cecka <- kocka$cecka
    output <- c()
    for (i in 1:length(n)){
      output<- c(output,cecka %*% lambdas^n[i])
      
    }
    return (abs(output))
  }
  
  prekrocenieP <-  function (kocka){
    n <- length(kocka$pcka)
    vec <-c()
    inp <-c(rep(n,2*n))+c(1:n)
    for (i in 1:n){
      vec <- c(vec, sum(p(inp[i:n],kocka$lambdas,kocka$cecka)))
    }
    return (1/n*vec)
  }
  

    
    
  
 
  
  
  # Ako vyzeraju P(S_i=j) pre 8,12,20 - sten
  #   plot(x=seq(1:20), y=prekrocenieP(ikoKocka), lty=1, ylim=c(-0.02,.25),xlim=c(0,21),
  #        xaxs="i",
  #        xlab="j", ylab="P(S_i=j)")
  # points(x=c(1:12), y=prekrocenieP(dodKocka),col="blue")
  # points(x=c(1:8),y=prekrocenieP(oktKocka),col="red")
  # lines(x=c(1:20),y=prekrocenieP(ikoKocka),col="black",lwd=2)
  # lines(x=c(1:12), y=prekrocenieP(dodKocka),col="blue",lwd=2)
  # lines(x=c(1:8),y=prekrocenieP(oktKocka),col="red",lwd=2)
  # axis(side=1, labels=1:20, at=seq(1:20))
  # axis(side=2, at=seq(5,20,3), las=1)
  # op <- par(cex = 1.5)
  # legend(x=2, y=0.23 ,col=c("black","blue","red"),legend=c("dvadsatSten", "dvanastSten","osemSten"),lwd=5,  box.lty=0, ncol=3)

  
  #Graficka konvergencia p(n) pre rozne telesa
  kocka <- showResult(6)
  stvorSten <- showResult(4)
  osemsSten <- showResult(8)
  dvanastSten <- showResult(12)
  dvadsatSten <- showResult(20)
  n <- 1:10^2
  #Kocka 
    plot( p(n,kocka),type="l",xlab="i",ylab="p(i)", lwd=2, main="Konvergencia p(n) pre kocku",yaxt="n")
    ticks<- c(0.35,0.20)
    axis(2,at=ticks,labels=ticks)
    abline(h=p(1000,kocka), col="red")
    axis(2,at=p(1000,kocka),labels="0.2857143",col="red")  
  #Stvorsten
    plot( p(n,stvorSten),type="l",xlab="i",ylab="p(i)", lwd=2, main="Konvergencia p(n) pre �tvorsten",yaxt="n")
    ticks<- c(0.45,0.35)
    axis(2,at=ticks,labels=ticks)
    abline(h=p(1000,stvorSten), col="red")
    axis(2,at=p(1000,stvorSten),labels=p(1000,stvorSten),col="red")
  #Ostatne telesa v bp
    plot( p(n,osemsSten),type="l",xlab="i",ylab="p(i)", ylim=c(0,.35), lwd=2, main="Konvergencia p(n) pre ostatn� teles�",yaxt="n")
    ticks<- c(0.45,0.35)
    axis(2,at=ticks,labels=ticks)
    abline(h=p(1000,osemsSten), col="red")
    abline(h=p(1000,dvadsatSten), col="red")
    abline(h=p(1000,dvanastSten), col="red")
    axis(2,at=c(p(1000,osemsSten),p(1000,dvanastSten),p(1000,dvadsatSten)),labels=c(round(p(1000,osemsSten),4),round(p(1000,dvanastSten),4),round(p(1000,dvadsatSten),4)),col="red")
    lines(p(n,dvanastSten),type="l",lwd=2,col="green")
    lines(p(n,dvadsatSten),type="l",lwd=2,col="blue")
    legend(70, .32, legend=c("osemSten", "dvanastSten","dvadsatSten"),
           col=c("black","green", "blue"), lty=1,lwd=2, cex=1.3)
    